-- Fix RLS recursion on public.agency_members and dependent policies.

create or replace function public.is_agency_member(_agency_id text, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.agency_members m
    where m.agency_id = _agency_id
      and m.user_id = _user_id
  );
$$;

create or replace function public.is_agency_manager(_agency_id text, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.agency_members m
    where m.agency_id = _agency_id
      and m.user_id = _user_id
      and m.role = 'manager'
  );
$$;

grant execute on function public.is_agency_member(text, uuid) to authenticated, anon;
grant execute on function public.is_agency_manager(text, uuid) to authenticated, anon;

-- agency_members: remove recursive policy and replace with function-based checks.
drop policy if exists agency_members_select_visible on public.agency_members;
create policy agency_members_select_visible
on public.agency_members
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_agency_member(agency_id, auth.uid())
);

drop policy if exists agency_members_insert_manager on public.agency_members;
create policy agency_members_insert_manager
on public.agency_members
for insert
to authenticated
with check (
  public.is_agency_manager(agency_id, auth.uid())
);

drop policy if exists agency_members_update_manager on public.agency_members;
create policy agency_members_update_manager
on public.agency_members
for update
to authenticated
using (
  public.is_agency_manager(agency_id, auth.uid())
)
with check (
  public.is_agency_manager(agency_id, auth.uid())
);

drop policy if exists agency_members_delete_manager on public.agency_members;
create policy agency_members_delete_manager
on public.agency_members
for delete
to authenticated
using (
  public.is_agency_manager(agency_id, auth.uid())
);

-- invites policies now rely on helper functions too.
drop policy if exists agency_member_invites_select on public.agency_member_invites;
create policy agency_member_invites_select on public.agency_member_invites
for select to authenticated
using (
  public.is_agency_member(agency_id, auth.uid())
  or lower(trim(invited_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
);

drop policy if exists agency_member_invites_insert_manager on public.agency_member_invites;
create policy agency_member_invites_insert_manager on public.agency_member_invites
for insert to authenticated
with check (
  public.is_agency_manager(agency_id, auth.uid())
);

drop policy if exists agency_member_invites_update on public.agency_member_invites;
create policy agency_member_invites_update on public.agency_member_invites
for update to authenticated
using (
  public.is_agency_manager(agency_id, auth.uid())
  or lower(trim(invited_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
)
with check (
  public.is_agency_manager(agency_id, auth.uid())
  or lower(trim(invited_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
);
