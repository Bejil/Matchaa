-- Historique « messages envoyés » côté particulier (synchronisé entre appareils).
create table if not exists public.user_sent_messages (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_sent_messages_user_id_created_at_idx
  on public.user_sent_messages (user_id, created_at desc);

comment on table public.user_sent_messages is 'Copie serveur des envois de contact / récap affichés dans le compte public (max 30 gérés côté app).';

alter table public.user_sent_messages enable row level security;

drop policy if exists user_sent_messages_select_own on public.user_sent_messages;
create policy user_sent_messages_select_own on public.user_sent_messages
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists user_sent_messages_insert_own on public.user_sent_messages;
create policy user_sent_messages_insert_own on public.user_sent_messages
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists user_sent_messages_delete_own on public.user_sent_messages;
create policy user_sent_messages_delete_own on public.user_sent_messages
  for delete to authenticated
  using (auth.uid() = user_id);
