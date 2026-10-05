-- B-03: row-level security for every table, per the matrix in docs/plan/03-architecture.md.
-- Cross-table checks go through SECURITY DEFINER helpers (owner rights, search_path pinned) so policies never
-- recurse into each other's RLS. Anonymous callers get no policy and therefore no rows anywhere.

-- Helpers -----------------------------------------------------------------------------------------------
create or replace function public.app_role()
returns public.profile_role
language sql
stable
security definer
set search_path = public
as $$
    select role from public.profiles where id = auth.uid()
$$;

create or replace function public.app_cluster_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
    select cluster_id from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.app_role() = 'admin'
$$;

create or replace function public.is_coordinator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.app_role() = 'coordinator'
$$;

create or replace function public.farm_owned_by_me(farm text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.farms f where f.id = farm and f.farmer_id = auth.uid()
    )
$$;

create or replace function public.farm_in_my_cluster(farm text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.is_coordinator()
       and exists (
        select 1 from public.farms f
        where f.id = farm and f.cluster_id = public.app_cluster_id()
    )
$$;

create or replace function public.lot_owned_by_me(lot text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.lots l
        join public.farms f on f.id = l.farm_id
        where l.id = lot and f.farmer_id = auth.uid()
    )
$$;

create or replace function public.lot_in_my_cluster(lot text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.is_coordinator()
       and exists (
        select 1 from public.lots l
        join public.farms f on f.id = l.farm_id
        where l.id = lot and f.cluster_id = public.app_cluster_id()
    )
$$;

create or replace function public.lot_assigned_to_me(lot text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.hauls h where h.lot_id = lot and h.driver_id = auth.uid()
    )
$$;

create or replace function public.haul_in_my_cluster(haul text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.is_coordinator()
       and exists (
        select 1
        from public.hauls h
        join public.lots l on l.id = h.lot_id
        join public.farms f on f.id = l.farm_id
        where h.id = haul and f.cluster_id = public.app_cluster_id()
    )
$$;

create or replace function public.haul_on_my_lot(haul text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.hauls h
        join public.lots l on l.id = h.lot_id
        join public.farms f on f.id = l.farm_id
        where h.id = haul and f.farmer_id = auth.uid()
    )
$$;

create or replace function public.profile_in_my_cluster(profile uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.is_coordinator()
       and exists (
        select 1 from public.profiles p
        where p.id = profile and p.cluster_id = public.app_cluster_id()
    )
$$;

create or replace function public.my_vehicle_is(vehicle text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.drivers d where d.profile_id = auth.uid() and d.vehicle_id = vehicle
    )
$$;

create or replace function public.settlement_on_my_lot(settlement text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.settlements s
        join public.lots l on l.id = s.lot_id
        join public.farms f on f.id = l.farm_id
        where s.id = settlement and f.farmer_id = auth.uid()
    )
$$;

create or replace function public.settlement_in_my_cluster(settlement text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.is_coordinator()
       and exists (
        select 1
        from public.settlements s
        join public.lots l on l.id = s.lot_id
        join public.farms f on f.id = l.farm_id
        where s.id = settlement and f.cluster_id = public.app_cluster_id()
    )
$$;

-- Enable RLS everywhere ---------------------------------------------------------------------------------
alter table public.clusters enable row level security;
alter table public.profiles enable row level security;
alter table public.consents enable row level security;
alter table public.farms enable row level security;
alter table public.lots enable row level security;
alter table public.dryer_slots enable row level security;
alter table public.vehicles enable row level security;
alter table public.drivers enable row level security;
alter table public.hauls enable row level security;
alter table public.commitments enable row level security;
alter table public.rice_orders enable row level security;
alter table public.settlements enable row level security;
alter table public.sms_messages enable row level security;
alter table public.audit_log enable row level security;

-- clusters: any member reads their own; only admin writes ----------------------------------------------
create policy clusters_select_member on public.clusters
for select to authenticated
using (public.is_admin() or id = public.app_cluster_id());

create policy clusters_admin_write on public.clusters
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- profiles: own row; coordinator sees the cluster; admin everything ------------------------------------
create policy profiles_select on public.profiles
for select to authenticated
using (
    id = auth.uid()
    or public.is_admin()
    or public.profile_in_my_cluster(id)
);

create policy profiles_insert_self on public.profiles
for insert to authenticated
with check (id = auth.uid());

create policy profiles_update on public.profiles
for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy profiles_admin_delete on public.profiles
for delete to authenticated
using (public.is_admin());

-- consents: personal; proof is append-and-withdraw ------------------------------------------------------
create policy consents_select on public.consents
for select to authenticated
using (
    profile_id = auth.uid()
    or public.is_admin()
    or public.profile_in_my_cluster(profile_id)
);

create policy consents_insert_self on public.consents
for insert to authenticated
with check (profile_id = auth.uid());

create policy consents_update_self on public.consents
for update to authenticated
using (profile_id = auth.uid() or public.is_admin())
with check (profile_id = auth.uid() or public.is_admin());

-- farms: farmers own; coordinator the cluster; buyer and driver none -----------------------------------
create policy farms_select on public.farms
for select to authenticated
using (public.is_admin() or public.farm_owned_by_me(id) or public.farm_in_my_cluster(id));

create policy farms_insert on public.farms
for insert to authenticated
with check (public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()));

create policy farms_update on public.farms
for update to authenticated
using (public.is_admin() or public.farm_in_my_cluster(id))
with check (public.is_admin() or public.farm_in_my_cluster(id));

create policy farms_delete on public.farms
for delete to authenticated
using (public.is_admin() or public.farm_in_my_cluster(id));

-- lots: farmer via farm, coordinator via cluster, driver via assignment ---------------------------------
create policy lots_select on public.lots
for select to authenticated
using (
    public.is_admin()
    or public.lot_owned_by_me(id)
    or public.lot_in_my_cluster(id)
    or public.lot_assigned_to_me(id)
);

create policy lots_insert on public.lots
for insert to authenticated
with check (public.is_admin() or public.lot_in_my_cluster(id));

create policy lots_update on public.lots
for update to authenticated
using (public.is_admin() or public.lot_in_my_cluster(id))
with check (public.is_admin() or public.lot_in_my_cluster(id));

create policy lots_delete on public.lots
for delete to authenticated
using (public.is_admin() or public.lot_in_my_cluster(id));

-- dryer slots: coordinator schedules; farmer and assigned driver read -----------------------------------
create policy dryer_slots_select on public.dryer_slots
for select to authenticated
using (
    public.is_admin()
    or (public.is_coordinator() and cluster_id = public.app_cluster_id())
    or public.lot_owned_by_me(lot_id)
    or public.lot_assigned_to_me(lot_id)
);

create policy dryer_slots_write on public.dryer_slots
for all to authenticated
using (public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()))
with check (public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()));

-- vehicles / drivers ------------------------------------------------------------------------------------
create policy vehicles_select on public.vehicles
for select to authenticated
using (
    public.is_admin()
    or (public.is_coordinator() and cluster_id = public.app_cluster_id())
    or public.my_vehicle_is(id)
);

create policy vehicles_write on public.vehicles
for all to authenticated
using (public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()))
with check (public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()));

create policy drivers_select on public.drivers
for select to authenticated
using (profile_id = auth.uid() or public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()));

create policy drivers_insert on public.drivers
for insert to authenticated
with check (public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()));

create policy drivers_update on public.drivers
for update to authenticated
using (profile_id = auth.uid() or public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()))
with check (profile_id = auth.uid() or public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()));

create policy drivers_delete on public.drivers
for delete to authenticated
using (public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()));

-- hauls: driver own; coordinator cluster; farmer own lot -------------------------------------------------
create policy hauls_select on public.hauls
for select to authenticated
using (
    public.is_admin()
    or driver_id = auth.uid()
    or public.haul_in_my_cluster(id)
    or public.haul_on_my_lot(id)
);

create policy hauls_insert on public.hauls
for insert to authenticated
with check (public.is_admin() or public.lot_in_my_cluster(lot_id));

create policy hauls_update on public.hauls
for update to authenticated
using (driver_id = auth.uid() or public.is_admin() or public.haul_in_my_cluster(id))
with check (driver_id = auth.uid() or public.is_admin() or public.haul_in_my_cluster(id));

create policy hauls_delete on public.hauls
for delete to authenticated
using (public.is_admin() or public.haul_in_my_cluster(id));

-- commitments / rice orders: buyer own; coordinator cluster ---------------------------------------------
create policy commitments_select on public.commitments
for select to authenticated
using (buyer_id = auth.uid() or public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()));

create policy commitments_insert on public.commitments
for insert to authenticated
with check (buyer_id = auth.uid() or public.is_admin());

create policy commitments_update on public.commitments
for update to authenticated
using (buyer_id = auth.uid() or public.is_admin())
with check (buyer_id = auth.uid() or public.is_admin());

create policy commitments_delete on public.commitments
for delete to authenticated
using (buyer_id = auth.uid() or public.is_admin());

create policy rice_orders_select on public.rice_orders
for select to authenticated
using (buyer_id = auth.uid() or public.is_admin() or (public.is_coordinator() and cluster_id = public.app_cluster_id()));

create policy rice_orders_insert on public.rice_orders
for insert to authenticated
with check (buyer_id = auth.uid() or public.is_admin());

create policy rice_orders_update on public.rice_orders
for update to authenticated
using (buyer_id = auth.uid() or public.is_admin())
with check (buyer_id = auth.uid() or public.is_admin());

create policy rice_orders_delete on public.rice_orders
for delete to authenticated
using (public.is_admin());

-- settlements: farmer reads own; coordinator marks paid once --------------------------------------------
create policy settlements_select on public.settlements
for select to authenticated
using (public.is_admin() or public.settlement_on_my_lot(id) or public.settlement_in_my_cluster(id));

create policy settlements_update_unpaid on public.settlements
for update to authenticated
using (public.is_admin() or (public.settlement_in_my_cluster(id) and paid_at is null))
with check (public.is_admin() or public.settlement_in_my_cluster(id));

-- sms messages: own thread; coordinator the cluster thread ----------------------------------------------
create policy sms_messages_select on public.sms_messages
for select to authenticated
using (
    profile_id = auth.uid()
    or public.is_admin()
    or public.profile_in_my_cluster(profile_id)
);

create policy sms_messages_insert on public.sms_messages
for insert to authenticated
with check (profile_id = auth.uid() or public.is_admin());

create policy sms_messages_admin_update on public.sms_messages
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

-- audit log: admin reads; only service role and definer triggers append ---------------------------------
create policy audit_log_select_admin on public.audit_log
for select to authenticated
using (public.is_admin());

revoke insert, update, delete on public.audit_log from anon, authenticated;
