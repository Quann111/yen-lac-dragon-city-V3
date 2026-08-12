-- Chạy thủ công trong Supabase SQL Editor của project uzbbwbtvkurlynrxocqc.
-- Script này cấp quyền tuyển dụng cho user đã tồn tại trong Supabase Auth.

create table if not exists public.recruitment_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

do $$
declare
  admin_user_id uuid;
begin
  select id
  into admin_user_id
  from auth.users
  where lower(email) = lower('tuyendung@d-park.com.vn')
  limit 1;

  if admin_user_id is null then
    raise exception 'Không tìm thấy Auth user tuyendung@d-park.com.vn';
  end if;

  insert into public.recruitment_admins (user_id)
  values (admin_user_id)
  on conflict (user_id) do nothing;
end $$;

alter table public.recruitment_admins enable row level security;

drop policy if exists "Admins can read own membership"
on public.recruitment_admins;

create policy "Admins can read own membership"
on public.recruitment_admins
for select
to authenticated
using (user_id = (select auth.uid()));

grant usage on schema public to authenticated;
grant select on public.recruitment_admins to authenticated;

select
  u.id,
  u.email,
  ra.created_at
from auth.users u
join public.recruitment_admins ra on ra.user_id = u.id
where lower(u.email) = lower('tuyendung@d-park.com.vn');
