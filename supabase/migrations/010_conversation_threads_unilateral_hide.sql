-- Masquage unilatéral des fils : chaque partie peut « supprimer » de son côté sans effacer le thread pour l’autre.

alter table public.conversation_threads
  add column if not exists hidden_from_public_at timestamptz null;

alter table public.conversation_threads
  add column if not exists hidden_from_agency_at timestamptz null;

comment on column public.conversation_threads.hidden_from_public_at is 'Le particulier a masqué ce fil (visible côté agence tant que hidden_from_agency_at est null).';
comment on column public.conversation_threads.hidden_from_agency_at is 'L’agence a masqué ce fil (visible côté public tant que hidden_from_public_at est null).';
