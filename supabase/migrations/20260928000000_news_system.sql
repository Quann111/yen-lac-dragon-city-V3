create extension if not exists pgcrypto;

do $$ begin
  create type public.news_status as enum ('draft', 'published');
exception when duplicate_object then null;
end $$;

create table if not exists public.news_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null,
  excerpt text not null check (char_length(excerpt) <= 500),
  cover_image_url text,
  content text not null,
  status public.news_status not null default 'draft',
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 180),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_posts_public_listing_idx on public.news_posts(status, published_at desc);
create index if not exists news_posts_category_idx on public.news_posts(category);

drop trigger if exists news_posts_set_updated_at on public.news_posts;
create trigger news_posts_set_updated_at before update on public.news_posts for each row execute function public.set_updated_at();

alter table public.news_admins enable row level security;
alter table public.news_posts enable row level security;

drop policy if exists "News admins can read own membership" on public.news_admins;
create policy "News admins can read own membership" on public.news_admins
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Public can read published news" on public.news_posts;
create policy "Public can read published news" on public.news_posts
for select to anon, authenticated
using (status = 'published');

drop policy if exists "News admins can read all news" on public.news_posts;
create policy "News admins can read all news" on public.news_posts
for select to authenticated
using (exists (select 1 from public.news_admins a where a.user_id = (select auth.uid())));

drop policy if exists "News admins can insert news" on public.news_posts;
create policy "News admins can insert news" on public.news_posts
for insert to authenticated
with check (exists (select 1 from public.news_admins a where a.user_id = (select auth.uid())));

drop policy if exists "News admins can update news" on public.news_posts;
create policy "News admins can update news" on public.news_posts
for update to authenticated
using (exists (select 1 from public.news_admins a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.news_admins a where a.user_id = (select auth.uid())));

drop policy if exists "News admins can delete news" on public.news_posts;
create policy "News admins can delete news" on public.news_posts
for delete to authenticated
using (exists (select 1 from public.news_admins a where a.user_id = (select auth.uid())));

grant usage on schema public to anon, authenticated;
grant select on public.news_posts to anon, authenticated;
grant select on public.news_admins to authenticated;
grant select, insert, update, delete on public.news_posts to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-images',
  'news-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "News admins can upload images" on storage.objects;
create policy "News admins can upload images" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'news-images'
  and exists (select 1 from public.news_admins a where a.user_id = (select auth.uid()))
);

drop policy if exists "News admins can update images" on storage.objects;
create policy "News admins can update images" on storage.objects
for update to authenticated
using (
  bucket_id = 'news-images'
  and exists (select 1 from public.news_admins a where a.user_id = (select auth.uid()))
);

drop policy if exists "News admins can delete images" on storage.objects;
create policy "News admins can delete images" on storage.objects
for delete to authenticated
using (
  bucket_id = 'news-images'
  and exists (select 1 from public.news_admins a where a.user_id = (select auth.uid()))
);
