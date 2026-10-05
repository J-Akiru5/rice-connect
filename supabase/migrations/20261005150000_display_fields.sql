-- B-05: display fields the domain types need but the draft schema did not carry yet.
-- These are small, nullable columns so existing rows stay valid; the B-05 adapter fills safe fallbacks.
alter table public.drivers add column code text unique check (code ~ '^DR-\d{2}$');
alter table public.dryer_slots add column dryer text not null default 'RiceConnect Dryer';
alter table public.dryer_slots add column slot_time text;
alter table public.hauls add column route_via text;
alter table public.hauls add column route_to text;
alter table public.hauls add column km numeric(6, 1) check (km >= 0);
alter table public.rice_orders add column buyer_type text check (buyer_type in ('miller', 'retailer', 'market', 'restaurant'));
