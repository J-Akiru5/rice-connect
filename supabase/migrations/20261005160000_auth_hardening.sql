-- Auth hardening (owner request, 5 Oct): close the two privilege-escalation paths found in the B-02 design.
-- 1) handle_new_user trusted `raw_user_meta_data->>'role'`, so a self sign-up could claim `admin`.
-- 2) profiles_update allowed a signed-in user to change their own `role` column.
-- Real auth policy (password rules, rate limits, confirmations, MFA) lives in project settings; see M49.

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
        /* Admin accounts are created by RiceConnect, never by self sign-up metadata. */
        case
            when wanted in ('coordinator', 'buyer', 'driver', 'farmer') then wanted::public.profile_role
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

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.role is distinct from old.role then
        /* auth.uid() is null for service-role/definer work (migrations, admin API); otherwise an
           existing admin must be the actor. */
        if auth.uid() is not null and public.app_role() is distinct from 'admin' then
            raise exception 'profile role changes require an admin';
        end if;
    end if;
    return new;
end;
$$;

create trigger profiles_protect_role
before update on public.profiles
for each row execute function public.protect_profile_role();
