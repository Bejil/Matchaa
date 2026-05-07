create table if not exists public.agency_member_invites (
  id uuid primary key default gen_random_uuid(),
  agency_id text not null references public.agencies (id) on delete cascade,
  invited_email text not null,
  role text not null check (role in ('agent', 'manager')),
  invited_by_user_id uuid references auth.users (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'cancelled')),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists agency_member_invites_agency_idx on public.agency_member_invites (agency_id);
create index if not exists agency_member_invites_email_idx on public.agency_member_invites (lower(trim(invited_email)));
create index if not exists agency_member_invites_status_idx on public.agency_member_invites (status);

alter table public.agency_member_invites enable row level security;

drop policy if exists agency_member_invites_select on public.agency_member_invites;
create policy agency_member_invites_select on public.agency_member_invites
for select to authenticated
using (
  exists (
    select 1
    from public.agency_members m
    where m.agency_id = agency_member_invites.agency_id
      and m.user_id = auth.uid()
  )
  or lower(trim(agency_member_invites.invited_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
);

drop policy if exists agency_member_invites_insert_manager on public.agency_member_invites;
create policy agency_member_invites_insert_manager on public.agency_member_invites
for insert to authenticated
with check (
  exists (
    select 1
    from public.agency_members m
    where m.agency_id = agency_member_invites.agency_id
      and m.user_id = auth.uid()
      and m.role = 'manager'
  )
);

drop policy if exists agency_member_invites_update on public.agency_member_invites;
create policy agency_member_invites_update on public.agency_member_invites
for update to authenticated
using (
  exists (
    select 1
    from public.agency_members m
    where m.agency_id = agency_member_invites.agency_id
      and m.user_id = auth.uid()
      and m.role = 'manager'
  )
  or lower(trim(agency_member_invites.invited_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
)
with check (
  exists (
    select 1
    from public.agency_members m
    where m.agency_id = agency_member_invites.agency_id
      and m.user_id = auth.uid()
      and m.role = 'manager'
  )
  or lower(trim(agency_member_invites.invited_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
);

drop trigger if exists set_agency_member_invites_updated_at on public.agency_member_invites;
create trigger set_agency_member_invites_updated_at
before update on public.agency_member_invites
for each row execute function public.set_updated_at();
