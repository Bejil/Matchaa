-- Prospects activity becomes global (not tied to one agency).
-- CRM states stay agency-scoped.

alter table public.prospect_activity_events
  alter column agency_id drop not null;

alter table public.prospect_activity_events
  drop constraint if exists prospect_activity_events_agency_id_fkey;

create index if not exists prospect_activity_events_occurred_idx
  on public.prospect_activity_events (occurred_at desc);
