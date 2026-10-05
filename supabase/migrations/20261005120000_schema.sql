-- B-02: core schema, reviewed from the data-model draft in docs/plan/03-architecture.md.
-- Money is integer centavos; weights are kg; user-facing codes (F-014, L-03, H-07, ...) are the primary keys
-- so the Phase 3 adapters map straight onto the domain entities. Every table gets RLS in the next migration.

create extension if not exists citext with schema extensions;

-- Enums -------------------------------------------------------------------------------------------------
create type public.profile_role as enum ('coordinator', 'buyer', 'driver', 'farmer', 'admin');
create type public.farm_status as enum ('registered', 'verified', 'cluster');
create type public.lot_status as enum ('forecast', 'weighed');
create type public.slot_status as enum ('scheduled', 'confirmed', 'move_requested');
create type public.haul_status as enum ('requested', 'assigned', 'accepted', 'pickedup', 'delivered');
create type public.order_status as enum ('placed', 'cancelled');
create type public.sms_direction as enum ('inbound', 'outbound');
create type public.sms_status as enum ('queued', 'sent', 'delivered', 'failed', 'received');

-- Shared updated_at trigger -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Tables ------------------------------------------------------------------------------------------------
create table public.clusters (
    id uuid primary key default gen_random_uuid(),
    name text not null check (length(trim(name)) > 0),
    municipality text not null,
    created_at timestamptz not null default now()
);

create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    role public.profile_role not null default 'farmer',
    display_name text not null default '',
    mobile_e164 text unique,
    barangay text,
    cluster_id uuid references public.clusters (id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger profiles_set_updated
before update on public.profiles
for each row execute function public.set_updated_at();

create table public.consents (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles (id) on delete cascade,
    policy_version text not null,
    channel text not null default 'app',
    accepted_at timestamptz not null default now(),
    withdrawn_at timestamptz
);

create table public.farms (
    id text primary key check (id ~ '^F-\d{3,}$'),
    cluster_id uuid not null references public.clusters (id) on delete restrict,
    farmer_id uuid not null references public.profiles (id) on delete restrict,
    name text not null,
    barangay text not null,
    area_ha numeric(4, 1) not null check (area_ha > 0),
    variety text not null,
    planting_week text,
    harvest_week text check (harvest_week in ('W1', 'W2', 'W3', 'W4')),
    status public.farm_status not null default 'registered',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger farms_set_updated
before update on public.farms
for each row execute function public.set_updated_at();

create table public.lots (
    id text primary key check (id ~ '^L-\d{2,}$'),
    farm_id text not null references public.farms (id) on delete cascade,
    sacks integer check (sacks > 0),
    wet_kg integer check (wet_kg >= 0),
    dried_kg integer check (dried_kg >= 0),
    grade text,
    moisture_pct numeric(4, 1) check (moisture_pct between 0 and 100),
    harvest_date date,
    status public.lot_status not null default 'forecast',
    actual boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger lots_set_updated
before update on public.lots
for each row execute function public.set_updated_at();

create table public.dryer_slots (
    id text primary key check (id ~ '^D-\d+$'),
    cluster_id uuid not null references public.clusters (id) on delete restrict,
    day date not null,
    capacity_kg integer not null check (capacity_kg > 0),
    lot_id text references public.lots (id) on delete set null,
    kg integer check (kg >= 0),
    status public.slot_status not null default 'scheduled',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger dryer_slots_set_updated
before update on public.dryer_slots
for each row execute function public.set_updated_at();

create table public.vehicles (
    id text primary key check (length(trim(id)) > 0),
    cluster_id uuid not null references public.clusters (id) on delete restrict,
    kind text not null,
    capacity_sacks integer not null check (capacity_sacks > 0),
    plate text,
    price_centavos integer check (price_centavos >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger vehicles_set_updated
before update on public.vehicles
for each row execute function public.set_updated_at();

create table public.drivers (
    profile_id uuid primary key references public.profiles (id) on delete cascade,
    cluster_id uuid not null references public.clusters (id) on delete restrict,
    vehicle_id text references public.vehicles (id) on delete set null,
    available boolean not null default true,
    distance_km numeric(5, 1) check (distance_km >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger drivers_set_updated
before update on public.drivers
for each row execute function public.set_updated_at();

create table public.hauls (
    id text primary key check (id ~ '^H-\d+$'),
    lot_id text not null references public.lots (id) on delete restrict,
    driver_id uuid references public.drivers (profile_id) on delete set null,
    vehicle_id text references public.vehicles (id) on delete set null,
    sacks integer not null check (sacks > 0),
    status public.haul_status not null default 'requested',
    pickup_date date,
    override_by uuid references public.profiles (id) on delete set null,
    override_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger hauls_set_updated
before update on public.hauls
for each row execute function public.set_updated_at();

create table public.commitments (
    id text primary key check (id ~ '^C-\d{2,}$'),
    cluster_id uuid not null references public.clusters (id) on delete restrict,
    buyer_id uuid not null references public.profiles (id) on delete restrict,
    tonnes numeric(6, 2) not null check (tonnes > 0),
    grade text,
    price_centavos_per_kg integer not null check (price_centavos_per_kg > 0),
    window text[] not null default '{}',
    status text not null default 'open' check (status in ('open', 'full')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger commitments_set_updated
before update on public.commitments
for each row execute function public.set_updated_at();

create table public.rice_orders (
    id text primary key check (id ~ '^R-\d{2,}$'),
    cluster_id uuid not null references public.clusters (id) on delete restrict,
    buyer_id uuid not null references public.profiles (id) on delete restrict,
    kg integer not null check (kg > 0),
    sacks integer not null check (sacks > 0),
    total_centavos integer not null check (total_centavos >= 0),
    week text not null check (week in ('W1', 'W2', 'W3', 'W4')),
    status public.order_status not null default 'placed',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger rice_orders_set_updated
before update on public.rice_orders
for each row execute function public.set_updated_at();

create table public.settlements (
    id text primary key check (id ~ '^S-\d+$'),
    lot_id text not null unique references public.lots (id) on delete restrict,
    gross_centavos integer not null check (gross_centavos >= 0),
    advance_centavos integer not null check (advance_centavos >= 0),
    balance_centavos integer not null check (balance_centavos >= 0),
    paid_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger settlements_set_updated
before update on public.settlements
for each row execute function public.set_updated_at();

create table public.sms_messages (
    id text primary key check (length(trim(id)) > 0),
    profile_id uuid references public.profiles (id) on delete cascade,
    direction public.sms_direction not null,
    body text not null check (length(body) > 0),
    template text,
    status public.sms_status not null default 'queued',
    provider_id text,
    created_at timestamptz not null default now()
);

create table public.audit_log (
    id bigint generated always as identity primary key,
    actor_id uuid references public.profiles (id) on delete set null,
    entity text not null,
    entity_id text,
    action text not null,
    before jsonb,
    after jsonb,
    at timestamptz not null default now()
);

create or replace function public.audit_log_append_only()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    raise exception 'audit_log is append-only';
end;
$$;

create trigger audit_log_no_change
before update or delete on public.audit_log
for each row execute function public.audit_log_append_only();

-- Indexes -----------------------------------------------------------------------------------------------
create index farms_cluster_idx on public.farms (cluster_id);
create index farms_farmer_idx on public.farms (farmer_id);
create index lots_farm_idx on public.lots (farm_id);
create index dryer_slots_cluster_day_idx on public.dryer_slots (cluster_id, day);
create index hauls_lot_idx on public.hauls (lot_id);
create index hauls_driver_idx on public.hauls (driver_id);
create index commitments_buyer_idx on public.commitments (buyer_id);
create index commitments_cluster_idx on public.commitments (cluster_id);
create index rice_orders_buyer_idx on public.rice_orders (buyer_id);
create index rice_orders_cluster_idx on public.rice_orders (cluster_id);
create index sms_messages_profile_idx on public.sms_messages (profile_id, created_at);
create index audit_log_entity_idx on public.audit_log (entity, entity_id, at);

-- Profile on sign-up (consumed by the B-04 SupabaseAuthAdapter via options.data) ------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
    wanted text := meta ->> 'role';
begin
    insert into public.profiles (id, role, display_name, mobile_e164, barangay)
    values (
        new.id,
        case
            when wanted in ('coordinator', 'buyer', 'driver', 'farmer', 'admin') then wanted::public.profile_role
            else 'farmer'::public.profile_role
        end,
        coalesce(meta ->> 'display_name', ''),
        nullif(meta ->> 'mobile_e164', ''),
        nullif(meta ->> 'barangay', '')
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
