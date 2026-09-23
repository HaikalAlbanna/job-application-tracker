create type public.application_status as enum (
  'baru',
  'menunggu',
  'screening',
  'tes',
  'interview_hr',
  'interview_user',
  'offering',
  'diterima',
  'ditolak',
  'mundur',
  'tidak_ada_kabar',
  'ditutup'
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  company text not null check (char_length(trim(company)) > 0),
  position text not null check (char_length(trim(position)) > 0),
  link text not null default '' check (link = '' or link ~* '^https?://'),
  status public.application_status not null default 'baru',
  applied_date date not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_job_applications_status
  on public.job_applications (status);

create index if not exists idx_job_applications_applied_date
  on public.job_applications (applied_date desc);

create index if not exists idx_job_applications_company
  on public.job_applications (company);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_job_applications_updated_at on public.job_applications;

create trigger trg_job_applications_updated_at
before update on public.job_applications
for each row
execute function public.set_updated_at();

alter table public.job_applications enable row level security;

create policy if not exists "job_applications_select_public"
on public.job_applications
for select
using (true);

create policy if not exists "job_applications_insert_public"
on public.job_applications
for insert
with check (true);

create policy if not exists "job_applications_update_public"
on public.job_applications
for update
using (true)
with check (true);

create policy if not exists "job_applications_delete_public"
on public.job_applications
for delete
using (true);

grant usage on schema public to anon, authenticated;
grant all on table public.job_applications to anon, authenticated;
