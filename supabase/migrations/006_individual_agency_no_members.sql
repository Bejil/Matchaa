-- Individual agency mode:
-- - agencies.metadata->>'agency_kind' = 'individual'
-- - individual agencies cannot add members/invites (except initial bootstrap manager)

create or replace function public.is_individual_agency(_agency_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.agencies a
    where a.id = _agency_id
      and lower(trim(coalesce(a.metadata ->> 'agency_kind', 'standard'))) = 'individual'
  );
$$;

grant execute on function public.is_individual_agency(text) to authenticated, anon;

drop policy if exists agency_members_insert_manager on public.agency_members;
create policy agency_members_insert_manager
on public.agency_members
for insert
to authenticated
with check (
  (
    public.is_agency_manager(agency_id, auth.uid())
    and not public.is_individual_agency(agency_id)
  )
  or public.can_bootstrap_agency_manager(agency_id, auth.uid(), user_id, role)
);

drop policy if exists agency_members_insert_invited_self on public.agency_members;
create policy agency_members_insert_invited_self
on public.agency_members
for insert
to authenticated
with check (
  not public.is_individual_agency(agency_members.agency_id)
  and user_id = auth.uid()
  and exists (
    select 1
    from public.agency_member_invites i
    where i.agency_id = agency_members.agency_id
      and i.status = 'pending'
      and lower(trim(i.invited_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
      and (
        (agency_members.role = 'manager' and i.role = 'manager')
        or (agency_members.role = 'agent' and i.role in ('agent', 'manager'))
      )
  )
);

drop policy if exists agency_member_invites_insert_manager on public.agency_member_invites;
create policy agency_member_invites_insert_manager
on public.agency_member_invites
for insert
to authenticated
with check (
  public.is_agency_manager(agency_id, auth.uid())
  and not public.is_individual_agency(agency_id)
);
