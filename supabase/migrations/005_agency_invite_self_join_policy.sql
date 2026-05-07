-- Allow invited authenticated users to join an agency themselves.
-- This unblocks the "pending invite -> accepted on first login" flow.

drop policy if exists agency_members_insert_invited_self on public.agency_members;
create policy agency_members_insert_invited_self
on public.agency_members
for insert
to authenticated
with check (
  user_id = auth.uid()
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
