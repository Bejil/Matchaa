-- Allow authenticated users to create an agency and bootstrap first manager membership.

create or replace function public.can_bootstrap_agency_manager(
  _agency_id text,
  _auth_user_id uuid,
  _new_user_id uuid,
  _new_role text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    _auth_user_id is not null
    and _new_user_id = _auth_user_id
    and _new_role = 'manager'
    and exists (
      select 1 from public.agencies a where a.id = _agency_id
    )
    and not exists (
      select 1 from public.agency_members m where m.agency_id = _agency_id
    );
$$;

grant execute on function public.can_bootstrap_agency_manager(text, uuid, uuid, text) to authenticated, anon;

drop policy if exists agencies_insert_authenticated on public.agencies;
create policy agencies_insert_authenticated
on public.agencies
for insert
to authenticated
with check (true);

drop policy if exists agency_members_insert_manager on public.agency_members;
create policy agency_members_insert_manager
on public.agency_members
for insert
to authenticated
with check (
  public.is_agency_manager(agency_id, auth.uid())
  or public.can_bootstrap_agency_manager(agency_id, auth.uid(), user_id, role)
);
