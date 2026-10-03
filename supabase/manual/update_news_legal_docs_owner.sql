-- Sửa tên đơn vị đăng tải trong bài "Hồ sơ pháp lý dự án Yên Lạc Dragon City".
-- Thay "được D-Park Group đăng tải" (đoạn cuối bài) thành
-- "được Công ty cổ phần đô thị Dragon City - Chủ đầu tư Khu đô thị Dragon City đăng tải".
-- Chạy trong Supabase SQL Editor (hoặc psql) trên project uzbbwbtvkurlynrxocqc.

update public.news_posts
set content = replace(
      content,
      'được D-Park Group đăng tải',
      'được Công ty cổ phần đô thị Dragon City - Chủ đầu tư Khu đô thị Dragon City đăng tải'
    )
where id = 'e400d593-1da5-44a7-9c08-7d8dde5e4743'
  and content like '%được D-Park Group đăng tải%';
