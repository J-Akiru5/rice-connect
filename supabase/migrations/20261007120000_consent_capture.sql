-- Consent capture at sign-up (Phase 4 readiness, RA 10173). The sign-up form sends the accepted notice
-- version in the user metadata (`consent_version`); this trigger stores it in consents with channel 'app'.
-- Accounts created without a version (admin invites, seeds, fixtures) get no consent row, so a row always
-- means a real acceptance. Version constant: packages/domain/src/privacy.ts.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
    wanted text := meta ->> 'role';
    consent text := nullif(meta ->> 'consent_version', '');
begin
    insert into public.profiles (id, role, display_name, mobile_e164, barangay)
    values (
        new.id,
        /* Admin accounts are created by RiceConnect, never by self sign-up metadata (M49). */
        case
            when wanted in ('coordinator', 'buyer', 'driver', 'farmer') then wanted::public.profile_role
            else 'farmer'::public.profile_role
        end,
        coalesce(meta ->> 'display_name', ''),
        nullif(meta ->> 'mobile_e164', ''),
        nullif(meta ->> 'barangay', '')
    )
    on conflict (id) do nothing;
    if consent is not null then
        insert into public.consents (profile_id, policy_version, channel) values (new.id, consent, 'app');
    end if;
    return new;
end;
$$;
