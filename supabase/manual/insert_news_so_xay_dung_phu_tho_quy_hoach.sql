-- Chạy thủ công trong Supabase SQL Editor của project uzbbwbtvkurlynrxocqc.
-- Thêm bài tổng hợp từ bài báo "Sở Xây dựng Phú Thọ chú trọng công tác quy hoạch, góp phần hình thành các đô thị hiện đại" (Báo Xây dựng, đăng 11/11/2026):
-- https://batdongsan.baoxaydung.vn/so-xay-dung-phu-tho-chu-trong-cong-tac-quy-hoach-gop-phan-hinh-thanh-cac-do-thi-hien-dai-192261110220405636.htm
-- Nội dung được viết lại dưới dạng tóm tắt các ý chính, có dẫn nguồn; không sao chép toàn văn và không tải ảnh báo về repo.
-- Chạy lại nhiều lần vẫn an toàn: nếu slug đã tồn tại thì cập nhật lại nội dung.

insert into public.news_posts (
  title, slug, category, excerpt, cover_image_url, content,
  status, seo_title, seo_description, published_at
)
values (
  'Sở Xây dựng Phú Thọ chú trọng công tác quy hoạch, góp phần hình thành các đô thị hiện đại',
  'so-xay-dung-phu-tho-chu-trong-cong-tac-quy-hoach-hinh-thanh-do-thi-hien-dai',
  'Thị trường',
  'Sau khi sáp nhập, Sở Xây dựng Phú Thọ tập trung nâng cao chất lượng quy hoạch, quản lý phát triển đô thị và đầu tư đồng bộ hạ tầng; Khu đô thị Yên Lạc - Dragon City đang hoàn thiện hạ tầng phân kỳ 1.',
  null,
  $news$Sau khi sáp nhập, Sở Xây dựng Phú Thọ tập trung nâng cao chất lượng công tác quy hoạch, quản lý phát triển đô thị và đầu tư đồng bộ hạ tầng, tạo nền tảng mở rộng không gian phát triển và thúc đẩy kinh tế - xã hội bền vững.

**Đẩy nhanh lập, thẩm định và điều chỉnh đồ án quy hoạch**

Sở đã tham mưu UBND tỉnh ban hành nhiều văn bản về quản lý quy hoạch và chỉnh trang đô thị. Đến nay, Sở đã thẩm định, trình phê duyệt 28 đồ án quy hoạch và 68 nhiệm vụ lập quy hoạch. Một số đồ án quan trọng, như Quy hoạch chung thành phố Việt Trì đến năm 2040, đang được triển khai hoặc điều chỉnh. Sở cũng đang xây dựng cơ sở dữ liệu quản lý quy hoạch đến năm 2030.

**Quy hoạch các xã và đô thị mới**

Đối với 17 xã đã được phê duyệt nhiệm vụ quy hoạch, công tác lập quy hoạch đang được triển khai. Với 55 xã khác, 27 nhiệm vụ đã được thẩm định. Trong 28 đô thị, 7 đô thị đã được thẩm định, trong đó Tam Dương Bắc và Yên Thủy đã được phê duyệt.

**Phát triển đô thị và hạ tầng kỹ thuật**

Sở tham mưu triển khai các nhiệm vụ về hạ tầng kỹ thuật, hạ tầng xã hội, dịch vụ công ích đô thị và ứng phó biến đổi khí hậu. Sở cũng tham mưu phê duyệt phương án giá nước sạch cho 8 đơn vị cấp nước.

**Khu đô thị Yên Lạc - Dragon City**

Dự án đang hoàn thiện hạ tầng giao thông, san nền, cấp thoát nước, cây xanh và điện chiếu sáng ở phân kỳ 1. Theo Thông báo số 1653/SXD-QLN&TTBĐS ngày 13/02/2026, dự án đủ điều kiện huy động vốn thông qua hợp tác đầu tư, liên doanh, liên kết.

Nguồn: [Báo Xây dựng - Sở Xây dựng Phú Thọ chú trọng công tác quy hoạch](https://batdongsan.baoxaydung.vn/so-xay-dung-phu-tho-chu-trong-cong-tac-quy-hoach-gop-phan-hinh-thanh-cac-do-thi-hien-dai-192261110220405636.htm)$news$,
  'published',
  'Sở Xây dựng Phú Thọ chú trọng công tác quy hoạch, hình thành đô thị hiện đại',
  'Sở Xây dựng Phú Thọ đẩy nhanh lập, thẩm định quy hoạch; tiến độ hạ tầng Khu đô thị Yên Lạc - Dragon City phân kỳ 1.',
  '2026-11-11T07:26:00+07:00'
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
where slug = 'so-xay-dung-phu-tho-chu-trong-cong-tac-quy-hoach-hinh-thanh-do-thi-hien-dai';
