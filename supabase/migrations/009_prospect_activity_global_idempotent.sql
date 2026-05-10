-- Rend l'activité prospect vraiment globale (agency_id optionnel), de façon idempotente.
-- À exécuter si 008 n'a pas suffi (nom de contrainte différent, etc.).

alter table public.prospect_activity_events
  alter column agency_id drop not null;

do $$
declare
  r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on t.relnamespace = n.oid
    where n.nspname = 'public'
      and t.relname = 'prospect_activity_events'
      and c.contype = 'f'
      and pg_get_constraintdef(c.oid) like '%agency_id%'
  loop
    execute format('alter table public.prospect_activity_events drop constraint if exists %I', r.conname);
  end loop;
end
$$;

create index if not exists prospect_activity_events_occurred_idx
  on public.prospect_activity_events (occurred_at desc);

-- Les lignes sans agence restent visibles côté API (service role). Si un jour le client lit en RLS :
drop policy if exists prospect_activity_events_select_agency_member on public.prospect_activity_events;
create policy prospect_activity_events_select_agency_member on public.prospect_activity_events
for select to authenticated
using (
  prospect_activity_events.agency_id is null
  or exists (
    select 1
    from public.agency_members m
    where m.user_id = auth.uid()
      and m.agency_id = prospect_activity_events.agency_id
  )
);

drop policy if exists prospect_activity_events_insert_agency_member on public.prospect_activity_events;
create policy prospect_activity_events_insert_agency_member on public.prospect_activity_events
for insert to authenticated
with check (
  prospect_activity_events.agency_id is null
  or exists (
    select 1
    from public.agency_members m
    where m.user_id = auth.uid()
      and m.agency_id = prospect_activity_events.agency_id
  )
);
