-- Matchaa — schéma initial Postgres + RLS (à exécuter dans Supabase SQL Editor ou via CLI).
-- Parcours public / pro : colonne profiles.account_kind.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profils (1:1 auth.users) — account_kind exclusif public | pro
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  account_kind text not null check (account_kind in ('public', 'pro')),
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_account_kind_idx on public.profiles (account_kind);

-- ---------------------------------------------------------------------------
-- Agences & membres
-- ---------------------------------------------------------------------------
create table if not exists public.agencies (
  id text primary key,
  name text not null default '',
  logo_url text,
  contact_email text,
  contact_phone text,
  city text,
  address text,
  description text,
  credits_balance integer not null default 0,
  credits_plan text not null default 'none' check (credits_plan in ('none', 'annual')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agency_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  agency_id text not null references public.agencies (id) on delete cascade,
  role text not null check (role in ('agent', 'manager')),
  display_name text,
  credits_consumed_total integer not null default 0,
  credits_consumed_30d integer not null default 0,
  last_credit_consumption_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, agency_id)
);

create index if not exists agency_members_agency_id_idx on public.agency_members (agency_id);
create index if not exists agency_members_user_id_idx on public.agency_members (user_id);

-- ---------------------------------------------------------------------------
-- Annonces (payload JSON aligné ProListing côté app)
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id text primary key,
  agency_id text not null references public.agencies (id) on delete cascade,
  project_type text not null check (project_type in ('acheter', 'louer')),
  status text not null check (status in ('active', 'draft', 'archived')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_agency_id_idx on public.listings (agency_id);
create index if not exists listings_status_idx on public.listings (status);

-- ---------------------------------------------------------------------------
-- Crédits (mouvements par agence)
-- ---------------------------------------------------------------------------
create table if not exists public.agency_credit_ledger (
  id text primary key,
  agency_id text not null references public.agencies (id) on delete cascade,
  entry_type text not null,
  amount integer not null,
  occurred_at timestamptz not null default now(),
  by_member_id text,
  listing_id text,
  note text not null default '',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists agency_credit_ledger_agency_id_idx on public.agency_credit_ledger (agency_id);

-- ---------------------------------------------------------------------------
-- Favoris (compte connecté)
-- ---------------------------------------------------------------------------
create table if not exists public.listing_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  listing_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index if not exists listing_favorites_listing_id_idx on public.listing_favorites (listing_id);

-- ---------------------------------------------------------------------------
-- Recherches sauvegardées + dernière recherche
-- ---------------------------------------------------------------------------
create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  to_path text not null default '/annonces',
  query jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_searches_user_id_idx on public.saved_searches (user_id);

create table if not exists public.user_search_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  last_search jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Messagerie
-- ---------------------------------------------------------------------------
create table if not exists public.conversation_threads (
  id text primary key,
  agency_id text not null references public.agencies (id) on delete cascade,
  public_email text not null,
  public_name text not null default '',
  unread_public integer not null default 0,
  unread_pro integer not null default 0,
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists conversation_threads_agency_id_idx on public.conversation_threads (agency_id);
create index if not exists conversation_threads_public_email_idx on public.conversation_threads (lower(trim(public_email)));

create table if not exists public.thread_messages (
  id text primary key,
  thread_id text not null references public.conversation_threads (id) on delete cascade,
  author text not null check (author in ('public', 'pro')),
  body text not null default '',
  occurred_at timestamptz not null default now(),
  listing_id text,
  listing_title text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists thread_messages_thread_id_idx on public.thread_messages (thread_id);

-- ---------------------------------------------------------------------------
-- updated_at générique
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_agencies_updated_at on public.agencies;
create trigger set_agencies_updated_at
  before update on public.agencies
  for each row execute function public.set_updated_at();

drop trigger if exists set_agency_members_updated_at on public.agency_members;
create trigger set_agency_members_updated_at
  before update on public.agency_members
  for each row execute function public.set_updated_at();

drop trigger if exists set_listings_updated_at on public.listings;
create trigger set_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

drop trigger if exists set_saved_searches_updated_at on public.saved_searches;
create trigger set_saved_searches_updated_at
  before update on public.saved_searches
  for each row execute function public.set_updated_at();

drop trigger if exists set_user_search_state_updated_at on public.user_search_state;
create trigger set_user_search_state_updated_at
  before update on public.user_search_state
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Trigger : créer profiles à l’inscription (metadata.account_kind)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  kind text;
begin
  kind := coalesce(new.raw_user_meta_data ->> 'account_kind', 'public');
  if kind not in ('public', 'pro') then
    kind := 'public';
  end if;

  insert into public.profiles (id, account_kind, display_name)
  values (
    new.id,
    kind,
    coalesce(
      nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), '')
    )
  )
  on conflict (id) do update
    set display_name = excluded.display_name,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.agencies enable row level security;
alter table public.agency_members enable row level security;
alter table public.listings enable row level security;
alter table public.agency_credit_ledger enable row level security;
alter table public.listing_favorites enable row level security;
alter table public.saved_searches enable row level security;
alter table public.user_search_state enable row level security;
alter table public.conversation_threads enable row level security;
alter table public.thread_messages enable row level security;

-- profiles
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (auth.uid() = id);

-- agencies (lecture catalogue ; écriture réservée aux managers de l’agence)
drop policy if exists agencies_select_all on public.agencies;
create policy agencies_select_all on public.agencies for select using (true);

drop policy if exists agencies_update_manager on public.agencies;
create policy agencies_update_manager on public.agencies for update to authenticated using (
  exists (
    select 1 from public.agency_members m
    where m.agency_id = agencies.id
      and m.user_id = auth.uid()
      and m.role = 'manager'
  )
);

-- agency_members
drop policy if exists agency_members_select_visible on public.agency_members;
create policy agency_members_select_visible on public.agency_members for select to authenticated using (
  user_id = auth.uid()
  or exists (
    select 1 from public.agency_members self
    where self.agency_id = agency_members.agency_id
      and self.user_id = auth.uid()
  )
);

-- listings
drop policy if exists listings_select_published on public.listings;
create policy listings_select_published on public.listings for select to anon, authenticated using (status = 'active');

drop policy if exists listings_agency_all on public.listings;
create policy listings_agency_all on public.listings for all to authenticated using (
  exists (
    select 1 from public.agency_members m
    where m.agency_id = listings.agency_id
      and m.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.agency_members m
    where m.agency_id = listings.agency_id
      and m.user_id = auth.uid()
  )
);

-- agency_credit_ledger (lecture membres ; pas d’insert client — RPC / service plus tard)
drop policy if exists agency_credit_ledger_select on public.agency_credit_ledger;
create policy agency_credit_ledger_select on public.agency_credit_ledger for select to authenticated using (
  exists (
    select 1 from public.agency_members m
    where m.agency_id = agency_credit_ledger.agency_id
      and m.user_id = auth.uid()
  )
);

-- listing_favorites
drop policy if exists listing_favorites_select_own on public.listing_favorites;
create policy listing_favorites_select_own on public.listing_favorites for select using (auth.uid() = user_id);

drop policy if exists listing_favorites_insert_own on public.listing_favorites;
create policy listing_favorites_insert_own on public.listing_favorites for insert with check (auth.uid() = user_id);

drop policy if exists listing_favorites_delete_own on public.listing_favorites;
create policy listing_favorites_delete_own on public.listing_favorites for delete using (auth.uid() = user_id);

-- saved_searches
drop policy if exists saved_searches_all_own on public.saved_searches;
create policy saved_searches_all_own on public.saved_searches for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_search_state
drop policy if exists user_search_state_all_own on public.user_search_state;
create policy user_search_state_all_own on public.user_search_state for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- conversation_threads
drop policy if exists conversation_threads_select on public.conversation_threads;
create policy conversation_threads_select on public.conversation_threads for select to authenticated using (
  exists (
    select 1 from public.agency_members m
    where m.agency_id = conversation_threads.agency_id
      and m.user_id = auth.uid()
  )
  or lower(trim(public_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
);

drop policy if exists conversation_threads_insert on public.conversation_threads;
create policy conversation_threads_insert on public.conversation_threads for insert to authenticated with check (
  exists (
    select 1 from public.agency_members m
    where m.agency_id = conversation_threads.agency_id
      and m.user_id = auth.uid()
  )
  or lower(trim(public_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
);

drop policy if exists conversation_threads_update on public.conversation_threads;
create policy conversation_threads_update on public.conversation_threads for update to authenticated using (
  exists (
    select 1 from public.agency_members m
    where m.agency_id = conversation_threads.agency_id
      and m.user_id = auth.uid()
  )
  or lower(trim(public_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
);

-- thread_messages
drop policy if exists thread_messages_select on public.thread_messages;
create policy thread_messages_select on public.thread_messages for select to authenticated using (
  exists (
    select 1 from public.conversation_threads t
    where t.id = thread_messages.thread_id
      and (
        exists (
          select 1 from public.agency_members m
          where m.agency_id = t.agency_id
            and m.user_id = auth.uid()
        )
        or lower(trim(t.public_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
      )
  )
);

drop policy if exists thread_messages_insert on public.thread_messages;
create policy thread_messages_insert on public.thread_messages for insert to authenticated with check (
  exists (
    select 1 from public.conversation_threads t
    where t.id = thread_messages.thread_id
      and (
        exists (
          select 1 from public.agency_members m
          where m.agency_id = t.agency_id
            and m.user_id = auth.uid()
        )
        or lower(trim(t.public_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
      )
  )
);

drop policy if exists thread_messages_update on public.thread_messages;
create policy thread_messages_update on public.thread_messages for update to authenticated using (
  exists (
    select 1 from public.conversation_threads t
    where t.id = thread_messages.thread_id
      and (
        exists (
          select 1 from public.agency_members m
          where m.agency_id = t.agency_id
            and m.user_id = auth.uid()
        )
        or lower(trim(t.public_email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
      )
  )
);
