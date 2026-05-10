-- Prospects CRM + activité cross-device

create table if not exists public.prospect_identities (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text unique,
  email_normalized text,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prospect_identities_identity_check
    check (
      coalesce(nullif(trim(coalesce(anonymous_id, '')), ''), nullif(trim(coalesce(email_normalized, '')), ''), user_id::text) is not null
    )
);

create index if not exists prospect_identities_email_idx on public.prospect_identities (email_normalized);
create index if not exists prospect_identities_user_idx on public.prospect_identities (user_id);

drop trigger if exists set_prospect_identities_updated_at on public.prospect_identities;
create trigger set_prospect_identities_updated_at
  before update on public.prospect_identities
  for each row execute function public.set_updated_at();

create table if not exists public.prospect_activity_events (
  id uuid primary key default gen_random_uuid(),
  agency_id text not null references public.agencies (id) on delete cascade,
  prospect_identity_id uuid not null references public.prospect_identities (id) on delete cascade,
  event_type text not null check (event_type in ('view', 'favorite', 'lead', 'phone_reveal', 'message_sent', 'message_received')),
  listing_id text references public.listings (id) on delete set null,
  thread_id text references public.conversation_threads (id) on delete set null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists prospect_activity_events_agency_idx on public.prospect_activity_events (agency_id, occurred_at desc);
create index if not exists prospect_activity_events_identity_idx on public.prospect_activity_events (prospect_identity_id, occurred_at desc);
create index if not exists prospect_activity_events_listing_idx on public.prospect_activity_events (listing_id, occurred_at desc);

create table if not exists public.prospect_crm_states (
  id uuid primary key default gen_random_uuid(),
  agency_id text not null references public.agencies (id) on delete cascade,
  prospect_identity_id uuid not null references public.prospect_identities (id) on delete cascade,
  is_read boolean not null default false,
  is_favorite boolean not null default false,
  is_treated boolean not null default false,
  read_at timestamptz,
  treated_at timestamptz,
  updated_by_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (agency_id, prospect_identity_id)
);

create index if not exists prospect_crm_states_agency_idx on public.prospect_crm_states (agency_id, updated_at desc);

drop trigger if exists set_prospect_crm_states_updated_at on public.prospect_crm_states;
create trigger set_prospect_crm_states_updated_at
  before update on public.prospect_crm_states
  for each row execute function public.set_updated_at();

create or replace function public.resolve_prospect_identity(
  p_anonymous_id text default null,
  p_email text default null,
  p_user_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_anon text := nullif(trim(coalesce(p_anonymous_id, '')), '');
  v_email text := lower(trim(coalesce(p_email, '')));
  v_user uuid := p_user_id;
  v_id uuid;
begin
  if v_email = '' then
    v_email := null;
  end if;

  select id
  into v_id
  from public.prospect_identities
  where (v_user is not null and user_id = v_user)
     or (v_email is not null and email_normalized = v_email)
     or (v_anon is not null and anonymous_id = v_anon)
  order by updated_at desc
  limit 1;

  if v_id is null then
    insert into public.prospect_identities (anonymous_id, email_normalized, user_id)
    values (v_anon, v_email, v_user)
    returning id into v_id;
  else
    update public.prospect_identities
      set anonymous_id = coalesce(anonymous_id, v_anon),
          email_normalized = coalesce(email_normalized, v_email),
          user_id = coalesce(user_id, v_user),
          updated_at = now()
    where id = v_id;
  end if;

  return v_id;
end;
$$;

alter table public.prospect_identities enable row level security;
alter table public.prospect_activity_events enable row level security;
alter table public.prospect_crm_states enable row level security;

drop policy if exists prospect_identities_select_authenticated on public.prospect_identities;
create policy prospect_identities_select_authenticated on public.prospect_identities
for select to authenticated
using (true);

drop policy if exists prospect_activity_events_select_agency_member on public.prospect_activity_events;
create policy prospect_activity_events_select_agency_member on public.prospect_activity_events
for select to authenticated
using (
  exists (
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
  exists (
    select 1
    from public.agency_members m
    where m.user_id = auth.uid()
      and m.agency_id = prospect_activity_events.agency_id
  )
);

drop policy if exists prospect_crm_states_all_agency_member on public.prospect_crm_states;
create policy prospect_crm_states_all_agency_member on public.prospect_crm_states
for all to authenticated
using (
  exists (
    select 1
    from public.agency_members m
    where m.user_id = auth.uid()
      and m.agency_id = prospect_crm_states.agency_id
  )
)
with check (
  exists (
    select 1
    from public.agency_members m
    where m.user_id = auth.uid()
      and m.agency_id = prospect_crm_states.agency_id
  )
);
