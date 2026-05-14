-- Coordonnées / consentements contact + brouillon formulaire (compte public), synchronisés entre appareils.
alter table public.profiles
  add column if not exists contact_phone text not null default '',
  add column if not exists contact_opt_in_phone boolean not null default false,
  add column if not exists contact_opt_in_email boolean not null default false,
  add column if not exists contact_form_draft jsonb not null default '{}'::jsonb;

comment on column public.profiles.contact_phone is 'Téléphone affiché côté compte / formulaires contact (texte libre, ex. +33 6 …).';
comment on column public.profiles.contact_opt_in_phone is 'Consentement contact par téléphone (annonces / agences).';
comment on column public.profiles.contact_opt_in_email is 'Consentement contact par e-mail.';
comment on column public.profiles.contact_form_draft is 'Brouillon formulaire « Contacter l’annonceur » (JSON côté app).';

-- Renforce l’UPDATE RLS (with check) pour les nouvelles colonnes.
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
