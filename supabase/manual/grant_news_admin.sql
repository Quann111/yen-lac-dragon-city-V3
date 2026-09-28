-- Chạy thủ công trong Supabase SQL Editor của project uzbbwbtvkurlynrxocqc.
-- Script này cấp quyền quản trị tin tức cho user đã tồn tại trong Supabase Auth.
-- Đổi email bên dưới nếu bạn dùng tài khoản khác với admin tuyển dụng hiện có.

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

  insert into public.news_admins (user_id)
  values (admin_user_id)
  on conflict (user_id) do nothing;
end $$;

select
  u.id,
  u.email,
  na.created_at
from auth.users u
join public.news_admins na on na.user_id = u.id
where lower(u.email) = lower('tuyendung@d-park.com.vn');
