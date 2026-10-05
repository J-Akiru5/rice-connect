-- B-03: per-role RLS tests. `pnpm exec supabase test db` (and CI) run this as a transaction and roll it back.
begin;

create extension if not exists pgtap with schema extensions;

select plan(30);

-- Fixtures (run as the table owner, which bypasses RLS) -------------------------------------------------
insert into public.clusters (id, name, municipality) values
    ('11111111-1111-1111-1111-111111111111', 'Cluster One', 'Dingle'),
    ('22222222-2222-2222-2222-222222222222', 'Cluster Two', 'Dingle');

create function pg_temp.new_user(uid uuid, email text, role text, name text)
returns void
language sql
as $$
    insert into auth.users (
        instance_id, id, aud, role, email, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) values (
        '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', email, now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('role', role, 'display_name', name),
        now(), now()
    );
$$;

select pg_temp.new_user('aaaaaaa1-0000-0000-0000-000000000001', 'farmer1@example.com', 'farmer', 'Farmer One');
select pg_temp.new_user('aaaaaaa2-0000-0000-0000-000000000002', 'farmer2@example.com', 'farmer', 'Farmer Two');
select pg_temp.new_user('ccccccc1-0000-0000-0000-000000000001', 'coord1@example.com', 'coordinator', 'Coord One');
select pg_temp.new_user('ccccccc2-0000-0000-0000-000000000002', 'coord2@example.com', 'coordinator', 'Coord Two');
select pg_temp.new_user('bbbbbbb1-0000-0000-0000-000000000001', 'buyer1@example.com', 'buyer', 'Buyer One');
select pg_temp.new_user('bbbbbbb2-0000-0000-0000-000000000002', 'buyer2@example.com', 'buyer', 'Buyer Two');
select pg_temp.new_user('ddddddd1-0000-0000-0000-000000000001', 'driver1@example.com', 'driver', 'Driver One');
select pg_temp.new_user('ddddddd2-0000-0000-0000-000000000002', 'driver2@example.com', 'driver', 'Driver Two');
select pg_temp.new_user('eeeeeee1-0000-0000-0000-000000000001', 'admin1@example.com', 'admin', 'Admin One');

update public.profiles set cluster_id = '11111111-1111-1111-1111-111111111111', barangay = 'Licu-an'
where id in (
    'aaaaaaa1-0000-0000-0000-000000000001',
    'aaaaaaa2-0000-0000-0000-000000000002',
    'ccccccc1-0000-0000-0000-000000000001',
    'bbbbbbb1-0000-0000-0000-000000000001',
    'bbbbbbb2-0000-0000-0000-000000000002',
    'ddddddd1-0000-0000-0000-000000000001',
    'ddddddd2-0000-0000-0000-000000000002'
);
update public.profiles set cluster_id = '22222222-2222-2222-2222-222222222222'
where id = 'ccccccc2-0000-0000-0000-000000000002';

insert into public.farms (id, cluster_id, farmer_id, name, barangay, area_ha, variety, harvest_week, status) values
    ('F-001', '11111111-1111-1111-1111-111111111111', 'aaaaaaa1-0000-0000-0000-000000000001', 'Farm One', 'Licu-an', 1.5, 'NSIC Rc 222', 'W3', 'cluster'),
    ('F-002', '11111111-1111-1111-1111-111111111111', 'aaaaaaa2-0000-0000-0000-000000000002', 'Farm Two', 'Licu-an', 1.0, 'NSIC Rc 222', 'W3', 'cluster'),
    ('F-003', '22222222-2222-2222-2222-222222222222', 'aaaaaaa1-0000-0000-0000-000000000001', 'Farm Three', 'Ilajas', 2.0, 'NSIC Rc 160', 'W4', 'verified');

insert into public.lots (id, farm_id, sacks, wet_kg, dried_kg, grade, moisture_pct, status, actual) values
    ('L-01', 'F-001', 8, 400, 360, 'Grade 1', 14.0, 'weighed', true),
    ('L-02', 'F-002', 10, 500, 450, 'Grade 1', 14.0, 'weighed', true),
    ('L-03', 'F-003', 8, 400, 380, 'Grade 1', 13.5, 'forecast', false);

insert into public.vehicles (id, cluster_id, kind, capacity_sacks, plate) values
    ('V-1', '11111111-1111-1111-1111-111111111111', 'truck', 100, 'ABC 1234'),
    ('V-2', '22222222-2222-2222-2222-222222222222', 'pickup', 25, 'XYZ 9876');

insert into public.drivers (profile_id, cluster_id, vehicle_id, available, distance_km) values
    ('ddddddd1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'V-1', true, 3.2),
    ('ddddddd2-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'V-1', true, 4.5);

insert into public.hauls (id, lot_id, driver_id, vehicle_id, sacks, status) values
    ('H-1', 'L-01', 'ddddddd1-0000-0000-0000-000000000001', 'V-1', 8, 'assigned'),
    ('H-2', 'L-02', 'ddddddd2-0000-0000-0000-000000000002', 'V-1', 10, 'assigned'),
    ('H-3', 'L-03', 'ddddddd1-0000-0000-0000-000000000001', 'V-2', 8, 'requested');

insert into public.commitments (id, cluster_id, buyer_id, tonnes, grade, price_centavos_per_kg, weeks) values
    ('C-01', '11111111-1111-1111-1111-111111111111', 'bbbbbbb1-0000-0000-0000-000000000001', 5.0, 'Grade 1', 4600, '{W3}'),
    ('C-02', '11111111-1111-1111-1111-111111111111', 'bbbbbbb2-0000-0000-0000-000000000002', 2.0, 'Grade 1', 4500, '{W4}');

insert into public.rice_orders (id, cluster_id, buyer_id, kg, sacks, total_centavos, week, status) values
    ('R-01', '11111111-1111-1111-1111-111111111111', 'bbbbbbb1-0000-0000-0000-000000000001', 1000, 40, 4800000, 'W3', 'placed'),
    ('R-02', '11111111-1111-1111-1111-111111111111', 'bbbbbbb2-0000-0000-0000-000000000002', 1000, 40, 4800000, 'W3', 'placed');

insert into public.settlements (id, lot_id, gross_centavos, advance_centavos, balance_centavos, paid_at) values
    ('S-1', 'L-01', 10000000, 8000000, 2000000, null),
    ('S-2', 'L-02', 10000000, 8000000, 2000000, now());

insert into public.sms_messages (id, profile_id, direction, body, status) values
    ('M-01', 'aaaaaaa1-0000-0000-0000-000000000001', 'outbound', 'Harvest reminder', 'delivered'),
    ('M-02', 'aaaaaaa2-0000-0000-0000-000000000002', 'outbound', 'Harvest reminder', 'delivered');

insert into public.audit_log (actor_id, entity, entity_id, action) values
    ('eeeeeee1-0000-0000-0000-000000000001', 'farm', 'F-001', 'status_changed');

-- Farmer One --------------------------------------------------------------------------------------------
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"aaaaaaa1-0000-0000-0000-000000000001"}';

select is((select count(*)::int from public.farms), 2, 'farmer sees own farms');
select is((select count(*)::int from public.farms where id = 'F-002'), 0, 'farmer does not see another farm');
select is((select count(*)::int from public.lots), 2, 'farmer sees lots on own farms');
select is((select count(*)::int from public.hauls), 2, 'farmer sees hauls on own lots');
select is((select count(*)::int from public.settlements), 1, 'farmer sees only own settlement');
with u as (update public.settlements set balance_centavos = 1 where id = 'S-1' returning 1)
select is((select count(*)::int from u), 0, 'farmer cannot write settlements');
with u as (update public.farms set name = 'Nope' where id = 'F-002' returning 1)
select is((select count(*)::int from u), 0, 'farmer cannot update another farm');
select lives_ok(
    $$ insert into public.consents (profile_id, policy_version) values ('aaaaaaa1-0000-0000-0000-000000000001', 'v1') $$,
    'farmer can record own consent'
);
select throws_ok(
    $$ insert into public.consents (profile_id, policy_version) values ('aaaaaaa2-0000-0000-0000-000000000002', 'v1') $$,
    '42501',
    null,
    'farmer cannot record consent for another profile'
);
select is((select count(*)::int from public.sms_messages), 1, 'farmer sees only own SMS');
select is((select count(*)::int from public.audit_log), 0, 'farmer cannot read the audit log');

-- Buyer One ---------------------------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"bbbbbbb1-0000-0000-0000-000000000001"}';

select is((select count(*)::int from public.rice_orders), 1, 'buyer sees own order only');
select is((select count(*)::int from public.commitments), 1, 'buyer sees own commitment only');
select is((select count(*)::int from public.farms), 0, 'buyer sees no farms (aggregates only)');
select is((select count(*)::int from public.profiles), 1, 'buyer sees only own profile');
select throws_ok(
    $$ insert into public.audit_log (entity, action) values ('farm', 'sneaky') $$,
    '42501',
    null,
    'buyer cannot append to the audit log'
);

-- Coordinator One (cluster one) -------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"ccccccc1-0000-0000-0000-000000000001"}';

select is((select count(*)::int from public.farms), 2, 'coordinator sees own cluster farms');
select is((select count(*)::int from public.hauls), 2, 'coordinator sees own cluster hauls');
select is((select count(*)::int from public.profiles), 7, 'coordinator sees own cluster profiles');
with u as (update public.settlements set paid_at = now() where id = 'S-1' returning 1)
select is((select count(*)::int from u), 1, 'coordinator can mark an unpaid settlement paid');
with u as (update public.settlements set balance_centavos = 1 where id = 'S-2' returning 1)
select is((select count(*)::int from u), 0, 'coordinator cannot change a paid settlement');

-- Driver One --------------------------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"ddddddd1-0000-0000-0000-000000000001"}';

select is((select count(*)::int from public.hauls), 2, 'driver sees only own hauls');
select is((select count(*)::int from public.farms), 0, 'driver sees no farms');
with u as (update public.hauls set status = 'accepted' where id = 'H-1' returning 1)
select is((select count(*)::int from u), 1, 'driver can move own haul forward');
with u as (update public.hauls set status = 'accepted' where id = 'H-2' returning 1)
select is((select count(*)::int from u), 0, 'driver cannot update another haul');

-- Admin -------------------------------------------------------------------------------------------------
set local "request.jwt.claims" = '{"sub":"eeeeeee1-0000-0000-0000-000000000001"}';

select is((select count(*)::int from public.farms), 3, 'admin sees every farm');
select is((select count(*)::int from public.audit_log), 1, 'admin reads the audit log');
with u as (update public.settlements set paid_at = now() where id = 'S-2' returning 1)
select is((select count(*)::int from u), 1, 'admin can correct a paid settlement');

-- Anonymous ---------------------------------------------------------------------------------------------
set local role anon;

select is((select count(*)::int from public.farms), 0, 'anonymous sees no farms');
select is((select count(*)::int from public.audit_log), 0, 'anonymous sees no audit log');

reset role;

select * from finish();
rollback;
