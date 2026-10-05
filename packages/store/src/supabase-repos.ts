import type { SupabaseClient } from '@supabase/supabase-js';
import { parseSmsReply } from '@rc/domain/sms-reply';
import { dayLabel } from '@rc/domain/calendar';
import { settle } from '@rc/domain/settlement';
import { makeRiceOrder, type BuyerType } from '@rc/domain/buyers';
import { DRIED_KG_PER_HA } from '@rc/domain/seed';
import overrides from '@rc/domain/overrides.json';
import type { Commitment, Farm, Haul, Lot, RiceOrder, Slip, Slot, SmsMessage } from '@rc/domain/schemas';
import { RepoError, type Repos, type WriteOpts } from './repos';
import type { LocalCommitment, SmsReply, SlotStatus, HaulStatus, DirectoryRole } from './types';

/* B-05: Supabase repositories implementing the same interfaces as the seed mocks (docs/DECISIONS.md M48).
   Row-level security scopes every read and write to the signed-in profile; the adapter adds the display
   fields the UI expects, with the fallbacks documented in M48. Writes ignore the mock idempotency keys:
   primary keys and unique constraints make them naturally idempotent where it matters. */

type Row = Record<string, unknown>;
type DbError = { message: string } | null;
const s = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
const n = (v: unknown) => (typeof v === 'number' ? v : v == null ? 0 : Number(v));
const weeks = (v: unknown): Farm['harvestWeek'][] => {
    const list = (Array.isArray(v) ? v : [v]).filter(
        (x): x is Farm['harvestWeek'] => x === 'W1' || x === 'W2' || x === 'W3' || x === 'W4'
    );
    return list.length > 0 ? list : ['W1'];
};
const must = (error: DbError) => {
    if (error) throw new RepoError('unknown', error.message);
};
/** The DB enum uses snake_case (`move_requested`); the app type uses the hyphen. */
const dbSlotStatus = (v: SlotStatus) => v.replace('-', '_');
const appSlotStatus = (v: string): SlotStatus => v.replace('_', '-') as SlotStatus;
const one = <T>(data: T | null, what: string, id?: string): T => {
    if (data == null) throw new RepoError('not_found', `${what}${id ? ' ' + id : ''} not found`, id);
    return data;
};

/* ---------- row → domain (pure; exported for unit tests) ---------- */

export function rowToFarm(r: Row): Farm {
    const areaTenths = Math.round(n(r.area_ha) * 10);
    const driedKg = Math.round((areaTenths * DRIED_KG_PER_HA) / 10);
    const week = weeks(r.harvest_week)[0] ?? 'W1';
    const harvestDay = ['W1', 'W2', 'W3', 'W4'].indexOf(week) * 7;
    const mobile = s(r.mobile_e164);
    return {
        id: s(r.id),
        name: s(r.name),
        /* The demo mask keeps the last four digits; live numbers are E.164. */
        mobile: mobile ? `09•• ••• ${mobile.slice(-4)}` : '09•• ••• 0000',
        barangay: s(r.barangay) as Farm['barangay'],
        areaHa: areaTenths / 10,
        variety: s(r.variety),
        plantingWeek: s(r.planting_week),
        status: (s(r.status) || 'registered') as Farm['status'],
        harvestWeek: week,
        tonnes: Math.round(driedKg / 100) / 10,
        areaTenths,
        harvestDay,
        harvestLabel: dayLabel(harvestDay),
        driedKg
    };
}

export function rowToLot(r: Row, farm: Row): Lot {
    const week = weeks(farm.harvest_week)[0] ?? 'W1';
    const dayIndex = ['W1', 'W2', 'W3', 'W4'].indexOf(week) * 7;
    return {
        id: s(r.id),
        farm: s(r.farm_id),
        sacks: Math.max(1, n(r.sacks)),
        kgPerSack: overrides.kgPerSack,
        wetKg: n(r.wet_kg),
        driedKg: n(r.dried_kg),
        grade: s(r.grade) || 'Grade unknown',
        mc: n(r.moisture_pct) ? `${n(r.moisture_pct)}% MC` : s(r.grade) || 'MC unknown',
        week,
        dayIndex,
        mcPct: n(r.moisture_pct) || overrides.forecastMcPct,
        actual: Boolean(r.actual)
    };
}

export function rowToSlot(r: Row): Slot {
    const kg = n(r.kg);
    return {
        id: s(r.id),
        dryer: s(r.dryer) || 'RiceConnect Dryer',
        day: s(r.day).slice(0, 10),
        time: s(r.slot_time),
        sacks: Math.max(1, Math.round(kg / overrides.kgPerSack)),
        capacityPerDay: n(r.capacity_kg) || overrides.dryerKgPerDay,
        lot: s(r.lot_id),
        kg,
        dayIndex: 0
    };
}

export function rowToHaul(
    r: Row,
    lot: Row,
    farm: Row,
    driver: Row | null,
    profile: Row | null,
    vehicle: Row | null
): Haul {
    const place = s(farm.barangay) || 'Dingle';
    return {
        id: s(r.id),
        lot: s(r.lot_id),
        sacks: Math.max(1, n(r.sacks)),
        vehicle: vehicle ? s(vehicle.id) : null,
        driver: driver
            ? {
                  id: s(driver.code) || 'DR-00',
                  name: s(profile?.display_name) || 'Driver',
                  vehicle: vehicle ? s(vehicle.id) : '',
                  plate: s(vehicle?.plate),
                  available: Boolean(driver.available),
                  distanceKm: n(driver.distance_km)
              }
            : null,
        from: { label: s(farm.id), place },
        via: { label: s(r.route_via) || 'Dryer', place },
        to: { label: s(r.route_to) || 'Buyer', place },
        pickup: s(r.pickup_date),
        pickupDay: 0,
        km: n(r.km),
        legKm: [0, 0]
    };
}

export function rowToCommitment(r: Row, buyerName: string): Commitment {
    const window = weeks(r.weeks);
    return {
        id: s(r.id),
        buyer: buyerName || s(r.buyer_id),
        tonnes: n(r.tonnes),
        grade: s(r.grade) || 'Grade unknown',
        mc: `${overrides.forecastMcPct}% MC`,
        price: n(r.price_centavos_per_kg),
        week: window[0] ?? 'W1',
        filled: 0,
        status: s(r.status) === 'full' ? 'full' : 'open',
        window,
        mcPct: overrides.forecastMcPct,
        assumed: []
    };
}

export function rowToOrder(r: Row): RiceOrder {
    return {
        id: s(r.id),
        type: (s(r.buyer_type) || 'restaurant') as BuyerType,
        kg: n(r.kg),
        sacks: Math.max(1, n(r.sacks)),
        total: n(r.total_centavos),
        week: weeks(r.week)[0] ?? 'W1'
    };
}

export function rowToSlip(settlement: Row, lot: Row, farm: Row, haulId: string, slotId: string): Slip {
    const kg = n(lot.dried_kg);
    const derived = settle(kg);
    return {
        id: s(settlement.id),
        lot: s(lot.id),
        farm: s(farm.id),
        haul: haulId || 'H-0',
        slot: slotId || 'D-0',
        kg,
        gross: n(settlement.gross_centavos),
        drying: derived.drying,
        margin: derived.margin,
        net: n(settlement.gross_centavos) - derived.drying - derived.margin || derived.net,
        advance: n(settlement.advance_centavos),
        balance: n(settlement.balance_centavos),
        buyerFee: derived.buyerFee,
        date: s(settlement.paid_at || settlement.created_at).slice(0, 10)
    };
}

export function rowToSms(r: Row): SmsMessage {
    const key = s(r.template);
    const body = s(r.body);
    return {
        key: key === 'advance' || key === 'balance' ? key : 'slot',
        time: s(r.created_at).slice(0, 16).replace('T', ' '),
        text: { en: body, tl: body, hil: body }
    };
}

/* ---------- repositories ---------- */

export function createSupabaseRepos(client: SupabaseClient): Repos {
    const sessionProfile = async (): Promise<Row> => {
        const { data } = await client.auth.getUser();
        const user = data.user;
        if (!user) throw new RepoError('forbidden', 'not signed in');
        const profile = await client.from('profiles').select('*').eq('id', user.id).maybeSingle();
        return profile.data ?? { id: user.id, role: 'farmer', display_name: user.email ?? '' };
    };
    const lotRow = async (id: string): Promise<Row> => {
        const { data, error } = await client.from('lots').select('*').eq('id', id).maybeSingle();
        must(error);
        return one(data as Row | null, 'Lot', id);
    };
    const farmRow = async (id: string): Promise<Row> => {
        const { data, error } = await client.from('farms').select('*').eq('id', id).maybeSingle();
        must(error);
        return one(data as Row | null, 'Farm', id);
    };

    const farms: Repos['farms'] = {
        async get(id) {
            return rowToFarm(await farmRow(id));
        },
        async list(q) {
            let query = client.from('farms').select('*', { count: 'exact' }).order('id');
            if (q?.barangay) query = query.eq('barangay', q.barangay);
            if (q?.status) query = query.eq('status', q.status);
            if (q?.q) query = query.or(`id.ilike.%${q.q}%,name.ilike.%${q.q}%`);
            const page = Math.max(1, q?.page ?? 1);
            const size = Math.max(1, q?.size ?? 20);
            const { data, count, error } = await query.range((page - 1) * size, page * size - 1);
            must(error);
            return { rows: ((data ?? []) as Row[]).map(rowToFarm), total: count ?? 0, page, size };
        },
        async add(id, _opts) {
            const farm = await farms.get(id);
            const { error } = await client.from('farms').update({ status: 'cluster' }).eq('id', id);
            must(error);
            return { ...farm, status: 'cluster' };
        },
        async created() {
            return [];
        },
        async create(input, _opts: WriteOpts) {
            const profile = await sessionProfile();
            const { data: last } = await client.from('farms').select('id').order('id', { ascending: false }).limit(1);
            const next = Math.max(100, Number(s((last?.[0] as Row | undefined)?.id).slice(2)) || 100) + 1;
            const id = `F-${String(next).padStart(3, '0')}`;
            const { data, error } = await client
                .from('farms')
                .insert({
                    id,
                    cluster_id: profile.cluster_id,
                    /* B-05 simplification: the Add Farm form has no farmer account yet, so the creator is
                       recorded; the farmer-invite flow replaces this later (M48). */
                    farmer_id: profile.id,
                    name: input.name.trim(),
                    barangay: input.barangay,
                    area_ha: input.areaHa,
                    variety: input.variety,
                    harvest_week: input.harvestWeek,
                    status: 'cluster'
                })
                .select('*')
                .single();
            must(error);
            return rowToFarm(one(data as Row | null, 'Farm', id));
        }
    };

    const lots: Repos['lots'] = {
        async get(id) {
            const row = await lotRow(id);
            return rowToLot(row, await farmRow(s(row.farm_id)));
        },
        async list(q) {
            const { data, count, error } = await client.from('lots').select('*', { count: 'exact' }).order('id');
            must(error);
            const page = Math.max(1, q?.page ?? 1);
            const size = Math.max(1, q?.size ?? 20);
            const rows = (data ?? []) as Row[];
            const mapped: Lot[] = [];
            for (const r of rows) mapped.push(rowToLot(r, await farmRow(s(r.farm_id))));
            return { rows: mapped, total: count ?? mapped.length, page, size };
        },
        async byFarm(farmId) {
            const { data, error } = await client.from('lots').select('*').eq('farm_id', farmId).maybeSingle();
            must(error);
            return data ? rowToLot(data as Row, await farmRow(farmId)) : null;
        }
    };

    const slots: Repos['slots'] = {
        async get(id) {
            const { data, error } = await client.from('dryer_slots').select('*').eq('id', id).maybeSingle();
            must(error);
            return rowToSlot(one(data as Row | null, 'Slot', id));
        },
        async list(q) {
            const { data, count, error } = await client
                .from('dryer_slots')
                .select('*', { count: 'exact' })
                .order('day');
            must(error);
            const page = Math.max(1, q?.page ?? 1);
            const size = Math.max(1, q?.size ?? 20);
            const rows = (data ?? []) as Row[];
            return { rows: rows.map(rowToSlot), total: count ?? rows.length, page, size };
        },
        async status(id) {
            const { data, error } = await client.from('dryer_slots').select('status').eq('id', id).maybeSingle();
            must(error);
            return appSlotStatus(s(one(data as Row | null, 'Slot', id).status || 'scheduled'));
        },
        async setStatus(id, next, _opts) {
            const { data, error } = await client
                .from('dryer_slots')
                .update({ status: dbSlotStatus(next) })
                .eq('id', id)
                .select('*')
                .single();
            must(error);
            return rowToSlot(one(data as Row | null, 'Slot', id));
        }
    };

    const hauls: Repos['hauls'] = {
        async get(id) {
            const { data, error } = await client.from('hauls').select('*').eq('id', id).maybeSingle();
            must(error);
            const row = one(data as Row | null, 'Haul', id);
            const lot = await lotRow(s(row.lot_id));
            const farm = await farmRow(s(lot.farm_id));
            let driver: Row | null = null;
            let profile: Row | null = null;
            let vehicle: Row | null = null;
            if (row.driver_id) {
                const { data: d } = await client
                    .from('drivers')
                    .select('*')
                    .eq('profile_id', s(row.driver_id))
                    .maybeSingle();
                driver = (d as Row | null) ?? null;
                const { data: p } = await client.from('profiles').select('*').eq('id', s(row.driver_id)).maybeSingle();
                profile = (p as Row | null) ?? null;
                if (row.vehicle_id) {
                    const { data: v } = await client
                        .from('vehicles')
                        .select('*')
                        .eq('id', s(row.vehicle_id))
                        .maybeSingle();
                    vehicle = (v as Row | null) ?? null;
                }
            }
            return rowToHaul(row, lot, farm, driver, profile, vehicle);
        },
        async status(id) {
            const { data, error } = await client.from('hauls').select('status').eq('id', id).maybeSingle();
            must(error);
            return s(one(data as Row | null, 'Haul', id).status || 'assigned') as HaulStatus;
        },
        async setStatus(id, next, _opts) {
            const { data, error } = await client
                .from('hauls')
                .update({ status: next })
                .eq('id', id)
                .select('*')
                .single();
            must(error);
            const row = one(data as Row | null, 'Haul', id);
            const lot = await lotRow(s(row.lot_id));
            return rowToHaul(row, lot, await farmRow(s(lot.farm_id)), null, null, null);
        }
    };

    const commitments: Repos['commitments'] = {
        async list(q) {
            const { data, count, error } = await client.from('commitments').select('*', { count: 'exact' }).order('id');
            must(error);
            const page = Math.max(1, q?.page ?? 1);
            const size = Math.max(1, q?.size ?? 20);
            const rows = (data ?? []) as Row[];
            const buyerIds = [...new Set(rows.map((r) => s(r.buyer_id)).filter(Boolean))];
            const names = new Map<string, string>();
            if (buyerIds.length > 0) {
                const { data: profiles } = await client.from('profiles').select('id, display_name').in('id', buyerIds);
                for (const p of (profiles ?? []) as Row[]) names.set(s(p.id), s(p.display_name));
            }
            const mapped = rows.map((r) => rowToCommitment(r, names.get(s(r.buyer_id)) ?? s(r.buyer_id)));
            return { rows: mapped, total: count ?? mapped.length, page, size };
        },
        async mine() {
            const { data, error } = await client
                .from('commitments')
                .select('*')
                .order('created_at', { ascending: false });
            must(error);
            return ((data ?? []) as Row[]).map((r): LocalCommitment => ({
                id: s(r.id),
                tonnes: n(r.tonnes),
                price: n(r.price_centavos_per_kg),
                window: weeks(r.weeks),
                kg: 0,
                lots: []
            }));
        },
        async create(input, _opts) {
            const profile = await sessionProfile();
            const { data: last } = await client
                .from('commitments')
                .select('id')
                .order('id', { ascending: false })
                .limit(1);
            const next = Math.max(0, Number(s((last?.[0] as Row | undefined)?.id).slice(2)) || 0) + 1;
            const id = `C-${String(next).padStart(2, '0')}`;
            const { data, error } = await client
                .from('commitments')
                .insert({
                    id,
                    cluster_id: profile.cluster_id,
                    buyer_id: profile.id,
                    tonnes: input.tonnes,
                    price_centavos_per_kg: input.price,
                    weeks: input.window,
                    status: 'open'
                })
                .select('*')
                .single();
            must(error);
            const row = one(data as Row | null, 'Commitment', id);
            return {
                id: s(row.id),
                tonnes: n(row.tonnes),
                price: n(row.price_centavos_per_kg),
                window: weeks(row.weeks),
                kg: 0,
                lots: []
            };
        }
    };

    const orders: Repos['orders'] = {
        async list(q) {
            const { data, count, error } = await client
                .from('rice_orders')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false });
            must(error);
            const page = Math.max(1, q?.page ?? 1);
            const size = Math.max(1, q?.size ?? 20);
            const rows = (data ?? []) as Row[];
            return { rows: rows.map(rowToOrder), total: count ?? rows.length, page, size };
        },
        async create(input, _opts) {
            const profile = await sessionProfile();
            const { data: last } = await client
                .from('rice_orders')
                .select('id')
                .order('id', { ascending: false })
                .limit(1);
            const next = Math.max(0, Number(s((last?.[0] as Row | undefined)?.id).slice(2)) || 0) + 1;
            const id = `R-${String(next).padStart(3, '0')}`;
            const order = makeRiceOrder(input.type, input.sacks, input.week, next);
            const { data, error } = await client
                .from('rice_orders')
                .insert({
                    id,
                    cluster_id: profile.cluster_id,
                    buyer_id: profile.id,
                    buyer_type: input.type,
                    kg: order.kg,
                    sacks: order.sacks,
                    total_centavos: order.total,
                    week: input.week,
                    status: 'placed'
                })
                .select('*')
                .single();
            must(error);
            return rowToOrder(one(data as Row | null, 'Order', id));
        },
        async cancel(id, _opts) {
            const { error } = await client.from('rice_orders').update({ status: 'cancelled' }).eq('id', id);
            must(error);
        }
    };

    const settlements: Repos['settlements'] = {
        async get(lotId) {
            const { data, error } = await client.from('settlements').select('*').eq('lot_id', lotId).maybeSingle();
            must(error);
            const row = one(data as Row | null, 'Settlement', lotId);
            const lot = await lotRow(lotId);
            const farm = await farmRow(s(lot.farm_id));
            const { data: haul } = await client.from('hauls').select('id').eq('lot_id', lotId).limit(1);
            const { data: slot } = await client.from('dryer_slots').select('id').eq('lot_id', lotId).limit(1);
            return rowToSlip(
                row,
                lot,
                farm,
                s((haul?.[0] as Row | undefined)?.id),
                s((slot?.[0] as Row | undefined)?.id)
            );
        },
        async paidAt(lotId) {
            const { data, error } = await client
                .from('settlements')
                .select('paid_at')
                .eq('lot_id', lotId)
                .maybeSingle();
            must(error);
            if (!data) throw new RepoError('not_found', `No settlement for lot ${lotId} yet`, lotId);
            return (data as Row).paid_at ? s((data as Row).paid_at) : null;
        },
        async markPaid(lotId, _opts) {
            const paidAt = new Date().toISOString();
            const { data, error } = await client
                .from('settlements')
                .update({ paid_at: paidAt })
                .eq('lot_id', lotId)
                .is('paid_at', null)
                .select('paid_at')
                .maybeSingle();
            must(error);
            if (!data) {
                const existing = await settlements.paidAt(lotId);
                if (existing) throw new RepoError('conflict', `Settlement ${lotId} is already paid`, lotId);
                throw new RepoError('forbidden', `Settlement ${lotId} cannot be paid`, lotId);
            }
            return s((data as Row).paid_at);
        }
    };

    const sms: Repos['sms'] = {
        async list() {
            const { data, error } = await client
                .from('sms_messages')
                .select('*')
                .eq('direction', 'outbound')
                .order('created_at');
            must(error);
            return ((data ?? []) as Row[]).map(rowToSms);
        },
        async replies() {
            const { data, error } = await client
                .from('sms_messages')
                .select('*')
                .eq('direction', 'inbound')
                .order('created_at');
            must(error);
            return ((data ?? []) as Row[]).map((r, i): SmsReply => ({
                id: s(r.id),
                farm: s(r.profile_id),
                text: s(r.body),
                action: parseSmsReply(s(r.body)),
                seq: i + 1
            }));
        },
        async reply(text, _opts) {
            const profile = await sessionProfile();
            const { data, error } = await client
                .from('sms_messages')
                .insert({
                    id: `M-${Date.now().toString(36)}`,
                    profile_id: profile.id,
                    direction: 'inbound',
                    body: text.trim(),
                    status: 'received'
                })
                .select('*')
                .single();
            must(error);
            const row = one(data as Row | null, 'Reply');
            return {
                id: s(row.id),
                farm: s(row.profile_id),
                text: s(row.body),
                action: parseSmsReply(s(row.body)),
                seq: 1
            };
        }
    };

    /* Directory roles are a mock concept; live role writes go through the admin repository once accounts exist. */
    const admin: Repos['admin'] = {
        async overrides() {
            return { roles: {}, settings: {} };
        },
        async setRole(_key: string, _role: DirectoryRole) {
            throw new RepoError('forbidden', 'role changes need the accounts flow');
        },
        async clearRole() {
            return { roles: {}, settings: {} };
        },
        async setSetting(_key: string, _value: string) {
            throw new RepoError('forbidden', 'configuration changes land with the settings table');
        },
        async clearSetting() {
            return { roles: {}, settings: {} };
        }
    };

    return { farms, lots, slots, hauls, commitments, orders, settlements, sms, admin };
}
