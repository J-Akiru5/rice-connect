import { LocalAdapter, createMockRepos, createSupabaseClient, type Repos, type SessionRole } from '@rc/store';
import { createSupabaseRepos } from '@rc/store/supabase-repos';
import type { AnniProposal, AnniTool } from '@rc/ai/anni';

/* ANNI server context (A-03/M50): resolves the caller (live: Supabase JWT under RLS; demo: the deterministic
   seed through the mock repositories) and builds the role-scoped read tools. No writes here — actions come
   back as proposals the UI confirms. */

const ROLES: SessionRole[] = ['coordinator', 'buyer', 'driver', 'farmer', 'admin'];
const round1 = (n: number) => Math.round(n * 10) / 10;

export interface AnniServerOptions {
    live: boolean;
    url?: string;
    anonKey?: string;
    accessToken?: string;
    demoRole?: string;
}
export interface AnniServerContext {
    role: SessionRole;
    tools: AnniTool[];
    proposalKinds: AnniProposal['kind'][];
    context: string;
}
export type AnniServerResult = { ok: true; ctx: AnniServerContext } | { ok: false; code: 'forbidden' | 'validation' };

const param = (kind: 'none' | 'week' | 'status') => ({
    type: 'OBJECT',
    properties:
        kind === 'week'
            ? { week: { type: 'STRING', enum: ['W1', 'W2', 'W3', 'W4'] } }
            : kind === 'status'
              ? { status: { type: 'STRING', enum: ['requested', 'assigned', 'accepted', 'pickedup', 'delivered'] } }
              : {}
});

function buildTools(repos: Repos, role: SessionRole): AnniTool[] {
    const summary: AnniTool = {
        name: 'cluster_summary',
        description: 'Counts for the cluster: farms, farms in the cluster, forecast dried tonnes.',
        parameters: param('none'),
        run: async () => {
            const page = await repos.farms.list({ size: 200 });
            return {
                farms: page.total,
                inCluster: page.rows.filter((f) => f.status === 'cluster').length,
                driedTonnes: round1(page.rows.reduce((sum, f) => sum + f.driedKg, 0) / 1000)
            };
        }
    };
    const harvests: AnniTool = {
        name: 'list_harvests',
        description: 'Harvests by week: farm code, barangay, tonnes and date.',
        parameters: param('week'),
        run: async (args) => {
            const page = await repos.farms.list({ size: 200 });
            const week = typeof args.week === 'string' ? args.week : null;
            return page.rows
                .filter((f) => !week || f.harvestWeek === week)
                .slice(0, 12)
                .map((f) => ({
                    id: f.id,
                    barangay: f.barangay,
                    tonnes: f.tonnes,
                    week: f.harvestWeek,
                    date: f.harvestLabel
                }));
        }
    };
    const hauls: AnniTool = {
        name: 'list_hauls',
        description: 'Hauls with their status, lot and driver.',
        parameters: param('status'),
        run: async (args) => {
            const status = typeof args.status === 'string' ? (args.status as never) : undefined;
            const page = await repos.hauls.list({ status, size: 20 });
            return Promise.all(
                page.rows.map(async (h) => ({
                    id: h.id,
                    lot: h.lot,
                    status: await repos.hauls.status(h.id),
                    sacks: h.sacks,
                    driver: h.driver?.name ?? null
                }))
            );
        }
    };
    const dryer: AnniTool = {
        name: 'dryer_capacity',
        description: 'Dryer capacity per day: capacity, planned kg and free kg.',
        parameters: param('none'),
        run: async () => {
            const page = await repos.slots.list({ size: 50 });
            const byDay = new Map<string, { capacityKg: number; plannedKg: number }>();
            for (const s of page.rows) {
                const entry = byDay.get(s.day) ?? { capacityKg: s.capacityPerDay, plannedKg: 0 };
                entry.plannedKg += s.kg;
                byDay.set(s.day, entry);
            }
            return [...byDay.entries()].slice(0, 7).map(([day, v]) => ({
                day,
                capacityKg: v.capacityKg,
                plannedKg: v.plannedKg,
                freeKg: Math.max(0, v.capacityKg - v.plannedKg)
            }));
        }
    };
    const advances: AnniTool = {
        name: 'advances_due',
        description: 'Unpaid advances per lot: net and advance in centavos.',
        parameters: param('none'),
        run: async () => (await repos.settlements.advancesDue()).filter((a) => !a.paid).slice(0, 10)
    };
    const commitments: AnniTool = {
        name: 'list_commitments',
        description: 'Buyer commitments: id, tonnes, price per kg (centavos), weeks and status.',
        parameters: param('none'),
        run: async () => {
            if (role === 'buyer') {
                return (await repos.commitments.mine()).map((c) => ({
                    id: c.id,
                    tonnes: c.tonnes,
                    priceCentavosPerKg: c.price,
                    weeks: c.window
                }));
            }
            const page = await repos.commitments.list({ size: 10 });
            return page.rows.map((c) => ({
                id: c.id,
                buyer: c.buyer,
                tonnes: c.tonnes,
                priceCentavosPerKg: c.price,
                weeks: c.window,
                status: c.status
            }));
        }
    };
    const orders: AnniTool = {
        name: 'list_orders',
        description: 'Rice orders visible to the caller: id, buyer type, sacks, total centavos and week.',
        parameters: param('none'),
        run: async () => {
            const page = await repos.orders.list({ size: 10 });
            return page.rows.map((o) => ({
                id: o.id,
                type: o.type,
                sacks: o.sacks,
                totalCentavos: o.total,
                week: o.week
            }));
        }
    };
    const sms: AnniTool = {
        name: 'sms_thread',
        description: 'Farmer SMS thread and recent replies.',
        parameters: param('none'),
        run: async () => {
            const [thread, replies] = await Promise.all([repos.sms.list(), repos.sms.replies()]);
            return {
                messages: thread.slice(0, 3).map((m) => ({ key: m.key, time: m.time, text: m.text.en })),
                replies: replies.slice(-5).map((r) => ({ text: r.text, action: r.action }))
            };
        }
    };

    switch (role) {
        case 'coordinator':
        case 'admin':
            return [summary, harvests, hauls, dryer, advances, commitments, orders, sms];
        case 'buyer':
            return [summary, commitments, orders];
        case 'driver':
            return [hauls];
        default:
            return [advances, sms];
    }
}

const proposalsFor = (role: SessionRole): AnniProposal['kind'][] =>
    role === 'buyer' ? ['create_order'] : role === 'coordinator' || role === 'admin' ? ['mark_paid'] : [];

const contextFor = (role: SessionRole) =>
    `Caller role: ${role}. Read tools are already scoped to what this role may see; do not ask for or repeat anything else.`;

export async function resolveAnniContext(opts: AnniServerOptions): Promise<AnniServerResult> {
    if (!opts.live) {
        const role = ROLES.includes(opts.demoRole as SessionRole) ? (opts.demoRole as SessionRole) : 'farmer';
        return {
            ok: true,
            ctx: {
                role,
                tools: buildTools(createMockRepos(new LocalAdapter()), role),
                proposalKinds: proposalsFor(role),
                context: contextFor(role)
            }
        };
    }
    if (!opts.url || !opts.anonKey || !opts.accessToken) return { ok: false, code: 'forbidden' };
    const client = createSupabaseClient(opts.url, opts.anonKey, { accessToken: opts.accessToken });
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) return { ok: false, code: 'forbidden' };
    const { data: profile } = await client.from('profiles').select('role').eq('id', userData.user.id).maybeSingle();
    const role = ROLES.includes(profile?.role as SessionRole) ? (profile?.role as SessionRole) : 'farmer';
    return {
        ok: true,
        ctx: {
            role,
            tools: buildTools(createSupabaseRepos(client), role),
            proposalKinds: proposalsFor(role),
            context: contextFor(role)
        }
    };
}
