-- B-06: audit log for every state change (who, what, when), per docs/plan/03-architecture.md.
-- The trigger runs as SECURITY DEFINER so it can append even though `authenticated` has no insert policy on
-- audit_log; `actor_id` is the signed-in profile (auth.uid()). sms_messages is excluded on purpose: its rows
-- are already an append-style history and body text must not be duplicated into the audit trail.

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    row_before jsonb;
    row_after jsonb;
begin
    if tg_op in ('UPDATE', 'DELETE') then
        row_before := to_jsonb(old);
    end if;
    if tg_op in ('INSERT', 'UPDATE') then
        row_after := to_jsonb(new);
    end if;
    insert into public.audit_log (actor_id, entity, entity_id, action, before_data, after_data)
    values (
        auth.uid(),
        tg_table_name,
        coalesce(row_after ->> 'id', row_before ->> 'id'),
        lower(tg_op),
        row_before,
        row_after
    );
    if tg_op = 'DELETE' then
        return old;
    end if;
    return new;
end;
$$;

create trigger audit_clusters
after insert or update or delete on public.clusters
for each row execute function public.audit_row_change();

create trigger audit_profiles
after insert or update or delete on public.profiles
for each row execute function public.audit_row_change();

create trigger audit_consents
after insert or update or delete on public.consents
for each row execute function public.audit_row_change();

create trigger audit_farms
after insert or update or delete on public.farms
for each row execute function public.audit_row_change();

create trigger audit_lots
after insert or update or delete on public.lots
for each row execute function public.audit_row_change();

create trigger audit_dryer_slots
after insert or update or delete on public.dryer_slots
for each row execute function public.audit_row_change();

create trigger audit_vehicles
after insert or update or delete on public.vehicles
for each row execute function public.audit_row_change();

create trigger audit_drivers
after insert or update or delete on public.drivers
for each row execute function public.audit_row_change();

create trigger audit_hauls
after insert or update or delete on public.hauls
for each row execute function public.audit_row_change();

create trigger audit_commitments
after insert or update or delete on public.commitments
for each row execute function public.audit_row_change();

create trigger audit_rice_orders
after insert or update or delete on public.rice_orders
for each row execute function public.audit_row_change();

create trigger audit_settlements
after insert or update or delete on public.settlements
for each row execute function public.audit_row_change();
