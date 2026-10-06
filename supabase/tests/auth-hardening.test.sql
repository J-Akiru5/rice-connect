-- Auth hardening: self sign-up cannot claim admin, and profile roles only change through an admin.
begin;

create extension if not exists pgtap with schema extensions;

select plan(3);

-- Fixtures ----------------------------------------------------------------------------------------------
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

-- 1) A self sign-up that claims admin is stored as a farmer.
select pg_temp.new_user('f0000001-0000-0000-0000-000000000001', 'sneaky@example.com', 'admin', 'Sneaky');
select is(
    (select role::text from public.profiles where id = 'f0000001-0000-0000-0000-000000000001'),
    'farmer',
    'admin metadata on sign-up becomes farmer'
);

-- 2) A farmer cannot change their own role.
select pg_temp.new_user('f0000002-0000-0000-0000-000000000002', 'hardfarmer@example.com', 'farmer', 'Hard Farmer');
select pg_temp.new_user('f0000003-0000-0000-0000-000000000003', 'hardadmin@example.com', 'admin', 'Hard Admin');
/* Admin accounts come from RiceConnect, not sign-up metadata (M49): promote the fixture as the owner. */
update public.profiles set role = 'admin' where id = 'f0000003-0000-0000-0000-000000000003';

set local role authenticated;
set local "request.jwt.claims" = '{"sub":"f0000002-0000-0000-0000-000000000002"}';

select throws_ok(
    $$ update public.profiles set role = 'admin' where id = 'f0000002-0000-0000-0000-000000000002' $$,
    'P0001',
    'profile role changes require an admin',
    'a farmer cannot promote themselves'
);

-- 3) An admin can change a profile role.
set local "request.jwt.claims" = '{"sub":"f0000003-0000-0000-0000-000000000003"}';

with u as (
    update public.profiles set role = 'coordinator' where id = 'f0000002-0000-0000-0000-000000000002' returning 1
)
select is((select count(*)::int from u), 1, 'an admin can change a role');

reset role;

select * from finish();
rollback;
