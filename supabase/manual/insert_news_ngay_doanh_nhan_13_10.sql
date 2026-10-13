-- Chạy thủ công trong Supabase SQL Editor của project uzbbwbtvkurlynrxocqc.
-- Thêm bài viết lấy nguyên nội dung và ảnh từ fanpage Facebook "Xã Yên Lạc - tỉnh Phú Thọ":
-- https://www.facebook.com/story.php?story_fbid=122208077990920997&id=61577629930435
-- Ảnh đã tải về, nén AVIF và lưu trong repo tại public/news/ngay-doanh-nhan-13-10-{1..5}.avif
-- (không dùng link trực tiếp tới fbcdn.net vì link ký sẵn của Facebook sẽ hết hạn).
-- Phải deploy cùng code để các đường dẫn /news/... có hiệu lực.
-- Chạy lại nhiều lần vẫn an toàn: nếu slug đã tồn tại thì cập nhật lại nội dung.

insert into public.news_posts (
  title, slug, category, excerpt, cover_image_url, content,
  status, seo_title, seo_description, published_at
)
values (
  'Đồng chí Nguyễn Mạnh Tuấn thăm, tặng hoa chúc mừng các doanh nghiệp, hợp tác xã nhân Ngày Doanh nhân Việt Nam 13/10',
  'dong-chi-nguyen-manh-tuan-tham-tang-hoa-chuc-mung-doanh-nghiep-hop-tac-xa-ngay-doanh-nhan-viet-nam-13-10',
  'Sự kiện',
  'Nhân dịp kỷ niệm Ngày Doanh nhân Việt Nam (13/10), đồng chí Nguyễn Mạnh Tuấn, Phó Bí thư Đảng ủy, Chủ tịch UBND xã Yên Lạc đã đến thăm, tặng hoa và chúc mừng Công ty Cổ phần Tập đoàn CNC Tech, Công ty Cổ phần Kehin, Công ty Cổ phần Đô thị Dragon City và Hợp tác xã Vật liệu xây dựng Tuổi trẻ.',
  '/news/ngay-doanh-nhan-13-10-3.avif',
  $news$Nhân dịp kỷ niệm Ngày Doanh nhân Việt Nam (13/10), đồng chí Nguyễn Mạnh Tuấn, Phó Bí thư Đảng ủy, Chủ tịch UBND xã Yên Lạc đã đến thăm, tặng hoa và chúc mừng Công ty Cổ phần Tập đoàn CNC Tech, Công ty Cổ phần Kehin, Công ty Cổ phần Đô thị Dragon City và Hợp tác xã Vật liệu xây dựng Tuổi trẻ.

![Thăm, tặng hoa chúc mừng Công ty Cổ phần Tập đoàn CNC Tech nhân Ngày Doanh nhân Việt Nam 13/10](/news/ngay-doanh-nhan-13-10-1.avif "Thăm, tặng hoa chúc mừng Công ty Cổ phần Tập đoàn CNC Tech.")

![Thăm, tặng hoa chúc mừng các doanh nghiệp nhân Ngày Doanh nhân Việt Nam 13/10](/news/ngay-doanh-nhan-13-10-2.avif)

Đây là những đơn vị hoạt động trong các lĩnh vực sản xuất công nghệ, cung cấp giải pháp công nghiệp và dịch vụ logistics; phát triển hạ tầng đô thị; sản xuất, kinh doanh vật liệu xây dựng. Với tinh thần năng động, sáng tạo và nỗ lực phát triển sản xuất, kinh doanh, các doanh nghiệp, hợp tác xã đã có nhiều đóng góp tích cực cho sự phát triển kinh tế - xã hội của xã Yên Lạc nói riêng và tỉnh Phú Thọ nói chung, góp phần tạo việc làm, nâng cao thu nhập cho người lao động và thúc đẩy phát triển kinh tế địa phương.

![Thăm, tặng hoa chúc mừng Công ty Cổ phần Đô thị Dragon City nhân Ngày Doanh nhân Việt Nam 13/10](/news/ngay-doanh-nhan-13-10-3.avif "Thăm, tặng hoa chúc mừng Công ty Cổ phần Đô thị Dragon City.")

![Thăm, tặng hoa chúc mừng Hợp tác xã nhân Ngày Doanh nhân Việt Nam 13/10](/news/ngay-doanh-nhan-13-10-4.avif)

Tại các đơn vị đến thăm, đồng chí Nguyễn Mạnh Tuấn đã gửi lời chúc mừng tốt đẹp nhất đến ban lãnh đạo cùng toàn thể cán bộ, người lao động nhân Ngày Doanh nhân Việt Nam 13/10; đồng thời ghi nhận, biểu dương những nỗ lực, đóng góp của các doanh nghiệp, hợp tác xã đối với sự phát triển chung của địa phương. Đồng chí mong muốn các đơn vị tiếp tục phát huy tinh thần đổi mới, sáng tạo, nâng cao năng lực cạnh tranh, mở rộng hoạt động sản xuất, kinh doanh gắn với thực hiện tốt các quy định của pháp luật, bảo đảm quyền và lợi ích hợp pháp của người lao động, tích cực tham gia các hoạt động an sinh xã hội và xây dựng quê hương.

![Trao đổi với lãnh đạo doanh nghiệp nhân Ngày Doanh nhân Việt Nam 13/10](/news/ngay-doanh-nhan-13-10-5.avif)

Việc thăm hỏi, tặng hoa chúc mừng nhân Ngày Doanh nhân Việt Nam 13/10 thể hiện sự quan tâm, trân trọng của cấp ủy, chính quyền địa phương đối với đội ngũ doanh nhân và cộng đồng doanh nghiệp, hợp tác xã; góp phần tăng cường mối quan hệ gắn bó giữa chính quyền với doanh nghiệp, khơi dậy tinh thần đồng hành, hợp tác, cùng phát triển, đóng góp thiết thực vào sự nghiệp phát triển kinh tế - xã hội của xã Yên Lạc và tỉnh Phú Thọ.

Nguồn: Fanpage Facebook [Xã Yên Lạc - tỉnh Phú Thọ](https://www.facebook.com/story.php?story_fbid=122208077990920997&id=61577629930435)$news$,
  'published',
  'Tặng hoa chúc mừng doanh nghiệp nhân Ngày Doanh nhân Việt Nam 13/10',
  'Chủ tịch UBND xã Yên Lạc Nguyễn Mạnh Tuấn thăm, tặng hoa chúc mừng CNC Tech, Kehin, Đô thị Dragon City và HTX Vật liệu xây dựng Tuổi trẻ nhân Ngày Doanh nhân Việt Nam 13/10.',
  '2026-10-13T12:30:00+07:00'
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
where slug = 'dong-chi-nguyen-manh-tuan-tham-tang-hoa-chuc-mung-doanh-nghiep-hop-tac-xa-ngay-doanh-nhan-viet-nam-13-10';
