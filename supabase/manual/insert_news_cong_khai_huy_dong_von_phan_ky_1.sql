-- Chạy thủ công trong Supabase SQL Editor của project uzbbwbtvkurlynrxocqc.
-- Thêm bài thuộc danh mục "Danh mục hồ sơ pháp lý": văn bản của Sở Xây dựng tỉnh Phú Thọ
-- "V/v công khai thông tin huy động vốn ... (tại phân kỳ 1) dự án khu đô thị Yên Lạc – Dragon City".
-- Nguồn: file PDF "12767-van ban dang tai thong tin.pdf" (2 trang, bản scan). Ảnh 2 trang đã nén AVIF tại
-- public/legal-docs/cong-khai-huy-dong-von-phan-ky-1-{cover,trang-1,trang-2}.avif — phải deploy cùng code.
-- Chạy lại nhiều lần vẫn an toàn: nếu slug đã tồn tại thì cập nhật lại nội dung.

-- Tiêu đề văn bản dài ~197 ký tự, vượt giới hạn cũ 160 -> nới lên 250 (trùng với migration 20261013000000_news_title_length.sql).
alter table public.news_posts drop constraint if exists news_posts_title_check;
alter table public.news_posts add constraint news_posts_title_check check (char_length(title) between 3 and 250);

insert into public.news_posts (
  title, slug, category, excerpt, cover_image_url, content,
  status, seo_title, seo_description, published_at
)
values (
  'V/v công khai thông tin huy động vốn thông qua việc góp vốn, hợp tác đầu tư, hợp tác kinh doanh, liên kết của các tổ chức, hộ gia đình cá nhân (tại phân kỳ 1) dự án khu đô thị Yên Lạc – Dragon City',
  'cong-khai-thong-tin-huy-dong-von-phan-ky-1-du-an-yen-lac-dragon-city',
  'Danh mục hồ sơ pháp lý',
  'Sở Xây dựng tỉnh Phú Thọ công khai thông tin huy động vốn thông qua việc góp vốn, hợp tác đầu tư, hợp tác kinh doanh, liên kết của các tổ chức, hộ gia đình, cá nhân tại phân kỳ 1 dự án Khu đô thị Yên Lạc - Dragon City, theo đề nghị của Công ty Cổ phần đô thị Dragon City.',
  '/legal-docs/cong-khai-huy-dong-von-phan-ky-1-cover.avif',
  $news$Sở Xây dựng tỉnh Phú Thọ có văn bản công khai thông tin huy động vốn thông qua việc góp vốn, hợp tác đầu tư, hợp tác kinh doanh, liên kết của các tổ chức, hộ gia đình, cá nhân (tại phân kỳ 1) dự án Khu đô thị Yên Lạc - Dragon City, gửi Công ty Cổ phần đô thị Dragon City.

## Nội dung chính của văn bản

- Sở Xây dựng nhận được văn bản số 47/CV-DC ngày 30/9/2026 của Công ty Cổ phần đô thị Dragon City về việc công khai thông tin huy động vốn thông qua việc góp vốn, hợp tác đầu tư, hợp tác kinh doanh, liên kết của các tổ chức, hộ gia đình cá nhân (phân kỳ 1) dự án Khu đô thị Yên Lạc - Dragon City.
- Căn cứ khoản 3 Điều 43, Nghị định số 95/2024/NĐ-CP ngày 24/7/2024 của Chính phủ quy định chi tiết một số điều của Luật Nhà ở: trong thời hạn tối đa 15 ngày kể từ ngày nhận được hồ sơ đề nghị của chủ đầu tư, cơ quan quản lý nhà ở cấp tỉnh kiểm tra hồ sơ; nếu đủ giấy tờ chứng minh thì phải có văn bản thông báo đủ điều kiện được huy động vốn gửi chủ đầu tư và đăng tải văn bản này trên Cổng thông tin điện tử của cơ quan quản lý nhà ở cấp tỉnh.
- Sở Xây dựng đăng tải thông tin huy động vốn tại phân kỳ 1 dự án Khu đô thị Yên Lạc - Dragon City trên cổng thông tin điện tử của Sở Xây dựng theo nội dung văn bản số 1653/SXD-QLN&TTBĐS ngày 13/02/2026 của Sở Xây dựng và văn bản số 47/CV-DC ngày 30/9/2026 của Công ty Cổ phần đô thị Dragon City (sao kèm văn bản số 1653/SXD-QLN&TTBĐS ngày 13/02/2026 của Sở Xây dựng).
- Trong quá trình thực hiện nếu có vướng mắc, đề nghị các tổ chức, cá nhân liên quan phản ánh về Sở Xây dựng Phú Thọ để được hướng dẫn, giải quyết.

## Văn bản công khai

![Văn bản của Sở Xây dựng Phú Thọ về công khai thông tin huy động vốn phân kỳ 1 - Trang 1](/legal-docs/cong-khai-huy-dong-von-phan-ky-1-trang-1.avif "Văn bản của Sở Xây dựng tỉnh Phú Thọ về công khai thông tin huy động vốn (phân kỳ 1) - Trang 1")

![Văn bản của Sở Xây dựng Phú Thọ về công khai thông tin huy động vốn phân kỳ 1 - Trang 2](/legal-docs/cong-khai-huy-dong-von-phan-ky-1-trang-2.avif "Trang 2 - Nơi nhận và chữ ký KT. Giám đốc Sở Xây dựng")

Văn bản trên là tài liệu công khai do cơ quan nhà nước có thẩm quyền ban hành, được Công ty cổ phần đô thị Dragon City - Chủ đầu tư Khu đô thị Dragon City đăng tải nhằm đảm bảo quyền được biết thông tin đầy đủ, chính xác của khách hàng theo quy định tại Điều 6, Luật Kinh doanh bất động sản số 29/2023/QH15.$news$,
  'published',
  'Công khai thông tin huy động vốn phân kỳ 1 dự án Yên Lạc Dragon City',
  'Sở Xây dựng Phú Thọ công khai thông tin huy động vốn (góp vốn, hợp tác đầu tư, hợp tác kinh doanh, liên kết) tại phân kỳ 1 dự án Khu đô thị Yên Lạc - Dragon City.',
  '2026-10-13T16:45:00+07:00'
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  excerpt = excluded.excerpt,
  cover_image_url = excluded.cover_image_url,
  content = excluded.content,
  status = excluded.status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

select id, title, slug, category, status, published_at
from public.news_posts
where slug = 'cong-khai-thong-tin-huy-dong-von-phan-ky-1-du-an-yen-lac-dragon-city';
