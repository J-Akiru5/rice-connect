-- Consent capture (Phase 4): a sign-up that sends the accepted notice version stores one consent row;
-- a sign-up without it stores none. See 20261007120000_consent_capture.sql.
begin;

create extension if not exists pgtap with schema extensions;

select plan(3);

create function pg_temp.new_user(uid uuid, email text, consent text)
returns void
language sql
as $$
    insert into auth.users (
        instance_id, id, aud, role, email, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) values (
        '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', email, now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('role', 'farmer', 'display_name', 'Consent Fixture', 'consent_version', consent),
        now(), now()
    );
$$;

-- 1) and 2) With a version, the row carries it and the channel.
select pg_temp.new_user('c0000001-0000-0000-0000-000000000001', 'consented@example.com', '2026-10-07');
select is(
    (select policy_version from public.consents where profile_id = 'c0000001-0000-0000-0000-000000000001'),
    '2026-10-07',
    'the consent row names the accepted notice version'
);
select is(
    (select channel from public.consents where profile_id = 'c0000001-0000-0000-0000-000000000001'),
    'app',
    'the consent row carries the channel'
);

-- 3) Without a version, nothing is stored.
select pg_temp.new_user('c0000002-0000-0000-0000-000000000002', 'unconsented@example.com', null);
select is(
    (select count(*)::int from public.consents where profile_id = 'c0000002-0000-0000-0000-000000000002'),
    0,
    'no consent row is written without a version'
);

select * from finish();
rollback;
