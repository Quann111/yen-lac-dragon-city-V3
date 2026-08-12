create extension if not exists pgcrypto;

do $$ begin
  create type public.job_status as enum ('draft', 'published', 'closed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.application_status as enum ('new', 'reviewing', 'interview', 'hired', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.notification_status as enum ('pending', 'sent', 'failed');
exception when duplicate_object then null;
end $$;

create table if not exists public.recruitment_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  department text not null,
  location text not null,
  employment_type text not null,
  quantity integer not null default 1 check (quantity > 0),
  salary_text text,
  summary text not null check (char_length(summary) <= 500),
  description text not null,
  requirements text not null,
  benefits text not null,
  deadline date,
  status public.job_status not null default 'draft',
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 180),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete restrict,
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 160),
  phone text not null check (char_length(phone) between 8 and 20),
  current_location text not null check (char_length(current_location) <= 180),
  portfolio_url text check (portfolio_url is null or char_length(portfolio_url) <= 500),
  cover_letter text check (cover_letter is null or char_length(cover_letter) <= 3000),
  cv_path text not null unique,
  original_cv_name text not null,
  consent_at timestamptz not null,
  status public.application_status not null default 'new',
  internal_notes text check (internal_notes is null or char_length(internal_notes) <= 5000),
  notification_status public.notification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_public_listing_idx on public.jobs(status, published_at desc);
create index if not exists applications_job_idx on public.applications(job_id, created_at desc);
create index if not exists applications_status_idx on public.applications(status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at before update on public.jobs for each row execute function public.set_updated_at();
drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at before update on public.applications for each row execute function public.set_updated_at();

alter table public.recruitment_admins enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

drop policy if exists "Admins can read own membership" on public.recruitment_admins;
create policy "Admins can read own membership" on public.recruitment_admins
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Public can read active jobs" on public.jobs;
create policy "Public can read active jobs" on public.jobs
for select to anon, authenticated
using (status = 'published' and (deadline is null or deadline >= current_date));

drop policy if exists "Recruitment admins can read all jobs" on public.jobs;
create policy "Recruitment admins can read all jobs" on public.jobs
for select to authenticated
using (exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Recruitment admins can insert jobs" on public.jobs;
create policy "Recruitment admins can insert jobs" on public.jobs
for insert to authenticated
with check (exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Recruitment admins can update jobs" on public.jobs;
create policy "Recruitment admins can update jobs" on public.jobs
for update to authenticated
using (exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Recruitment admins can delete jobs" on public.jobs;
create policy "Recruitment admins can delete jobs" on public.jobs
for delete to authenticated
using (exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Recruitment admins can read applications" on public.applications;
create policy "Recruitment admins can read applications" on public.applications
for select to authenticated
using (exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Recruitment admins can update applications" on public.applications;
create policy "Recruitment admins can update applications" on public.applications
for update to authenticated
using (exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid())));

grant usage on schema public to anon, authenticated;
grant select on public.jobs to anon, authenticated;
grant select on public.recruitment_admins to authenticated;
grant select, insert, update, delete on public.jobs to authenticated;
grant select, update on public.applications to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recruitment-cvs',
  'recruitment-cvs',
  false,
  5242880,
  array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Recruitment admins can read CVs" on storage.objects;
create policy "Recruitment admins can read CVs" on storage.objects
for select to authenticated
using (
  bucket_id = 'recruitment-cvs'
  and exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid()))
);

drop policy if exists "Recruitment admins can delete CVs" on storage.objects;
create policy "Recruitment admins can delete CVs" on storage.objects
for delete to authenticated
using (
  bucket_id = 'recruitment-cvs'
  and exists (select 1 from public.recruitment_admins a where a.user_id = (select auth.uid()))
);
