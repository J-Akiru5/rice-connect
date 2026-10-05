-- B-06: the audit trigger records who changed what, and the log stays append-only.
begin;

create extension if not exists pgtap with schema extensions;

select plan(4);

-- Fixtures ----------------------------------------------------------------------------------------------
insert into public.clusters (id, name, municipality) values
    ('33333333-3333-3333-3333-333333333333', 'Audit Cluster', 'Dingle');

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

select pg_temp.new_user('cccccccc-0000-0000-0000-000000000003', 'auditcoord@example.com', 'coordinator', 'Audit Coord');
update public.profiles set cluster_id = '33333333-3333-3333-3333-333333333333'
where id = 'cccccccc-0000-0000-0000-000000000003';

insert into public.farms (id, cluster_id, farmer_id, name, barangay, area_ha, variety, harvest_week, status) values
    ('F-101', '33333333-3333-3333-3333-333333333333', 'cccccccc-0000-0000-0000-000000000003', 'Audit Farm', 'Licu-an', 1.0, 'NSIC Rc 222', 'W3', 'registered');

-- The fixtures above were written as the owner: the trigger still records them with a null actor.
select is(
    (select count(*)::int from public.audit_log where entity = 'farms' and entity_id = 'F-101' and action = 'insert'),
    1,
    'insert is audited'
);

-- A coordinator change is audited with the coordinator as the actor.
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"cccccccc-0000-0000-0000-000000000003"}';

with u as (
    update public.farms set status = 'cluster' where id = 'F-101' returning 1
)
select is((select count(*)::int from u), 1, 'coordinator updates the farm');

reset role;

select is(
    (select count(*)::int from public.audit_log
        where entity = 'farms' and entity_id = 'F-101' and action = 'update'
        and actor_id = 'cccccccc-0000-0000-0000-000000000003'),
    1,
    'update is audited with the actor'
);

select throws_ok(
    $$ update public.audit_log set action = 'tampered' $$,
    'P0001',
    'audit_log is append-only',
    'the audit log cannot be edited'
);

select * from finish();
rollback;
