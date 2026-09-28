-- Chạy thủ công trong Supabase SQL Editor của project uzbbwbtvkurlynrxocqc.
-- Thêm bài viết lấy nguyên nội dung và ảnh từ Báo Xây dựng:
-- https://baoxaydung.vn/phu-tho-khu-do-thi-yen-lac-dragon-city-tang-toc-hoan-thien-ha-tang-canh-quan-192260925225310139.htm
-- Ảnh dùng trực tiếp URL gốc trên baoxaydung.mediacdn.vn (không upload lại lên bucket news-images).
-- Chạy lại nhiều lần vẫn an toàn: nếu slug đã tồn tại thì cập nhật lại nội dung.

insert into public.news_posts (
  title, slug, category, excerpt, cover_image_url, content,
  status, seo_title, seo_description, published_at
)
values (
  'Phú Thọ: Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan',
  'phu-tho-khu-do-thi-yen-lac-dragon-city-tang-toc-hoan-thien-ha-tang-canh-quan',
  'Sự kiện',
  'Với vị trí đắc địa, trung tâm của "Thủ phủ thương nghiệp miền Bắc", Khu đô thị Yên Lạc - Dragon City mang sứ mệnh thiết lập chuẩn mực đô thị hiện đại, mở rộng không gian phát triển và gia tăng sức hút đầu tư cho tỉnh Phú Thọ.',
  'https://baoxaydung.mediacdn.vn/603483875699699712/2026/9/25/17903496651127302734968060944329730273496806094432927f71bd6a088f2d824a6db19373a4045-17903502875421816865050.jpg',
  $news$Hiện nay, sau quá trình hoàn thiện các thủ tục pháp lý về đầu tư , Khu đô thị Yên Lạc - Dragon City đang tiếp tục triển khai các bước tiến cuối cùng hoàn thiện hạ tầng kỹ thuật, cây xanh và trải thảm nhựa đối với tuyến đường. Dự án đang từng bước hình thành diện mạo của một khu đô thị mới với hệ thống hạ tầng đồng bộ và không gian cảnh quan được đầu tư bài bản.

![Phú Thọ: Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan- Ảnh 1.](https://baoxaydung.mediacdn.vn/603483875699699712/2026/9/25/17903496651127302734968060944329730273496806094432927f71bd6a088f2d824a6db19373a4045-17903502875421816865050.jpg "Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan.")

Những tuyến đường nội khu, hệ thống cây xanh và các khu vực cảnh quan đang được triển khai đồng bộ, góp phần tạo nên không gian sống thông thoáng, hiện đại, đồng thời nâng cao giá trị sử dụng và tính kết nối của toàn khu đô thị.

![Phú Thọ: Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan- Ảnh 2.](https://baoxaydung.mediacdn.vn/603483875699699712/2026/9/25/3doc-17903505922842008195211.png "Khu đô thị Yên Lạc - Dragon City trở thành một điểm nhấn mới trong quá trình xây dựng diện mạo đô thị hiện đại của Phú Thọ.")

Hệ thống cây xanh, đường giao thông nội khu và hạ tầng kỹ thuật được chú trọng, hướng tới xây dựng một môi trường sống thuận tiện, xanh và hiện đại.

Với lợi thế về vị trí, quy hoạch và định hướng phát triển đồng bộ, Khu đô thị Yên Lạc - Dragon City đang được kỳ vọng trở thành một điểm nhấn mới trong quá trình xây dựng diện mạo đô thị hiện đại của Phú Thọ, góp phần tạo lập không gian sống chất lượng và mở rộng động lực phát triển kinh tế - xã hội trong những năm tới.

![Phú Thọ: Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan- Ảnh 3.](https://baoxaydung.mediacdn.vn/603483875699699712/2026/9/25/179035069907420657347720636385878500416477671301222e4f5b187b6f8ef7083e0af25b8592d0a-17903507293351317731460.jpg "Khu đô thị Yên Lạc - Dragon City được thực hiện đảm bảo chất lượng và tiến độ đề ra.")

Bên cạnh hệ thống tiện ích nội khu, dự án còn hưởng lợi từ mạng lưới dịch vụ hiện hữu trong khu vực. Từ đây, cư dân có thể thuận tiện tiếp cận các cơ quan hành chính, chợ dân sinh, trung tâm thương mại, trường học, cơ sở y tế, khu dịch vụ và các tuyến giao thông quan trọng.

![Phú Thọ: Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan- Ảnh 4.](https://baoxaydung.mediacdn.vn/603483875699699712/2026/9/25/179035081199720657347720636385878500416477671301222ef68e42f101a108a5abb0025013eba06-1790350931245131237881.jpg "Khu đô thị Yên Lạc - Dragon City mang một không gian đẳng cấp và sang trọng.")

Đặc biệt, dự án sở hữu lợi thế khi bao trọn toàn bộ khu vực Quảng trường Trung Tâm và Sân Vận Động, tạo điểm nhấn về không gian cộng đồng và cảnh quan đô thị.

![Phú Thọ: Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan- Ảnh 5.](https://baoxaydung.mediacdn.vn/603483875699699712/2026/9/25/1790349739770730273496806094432973027349680609443291b68e44417b679225acac25ecf610b12-17903502877261084879351.jpg)

![Phú Thọ: Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan- Ảnh 6.](https://baoxaydung.mediacdn.vn/603483875699699712/2026/9/25/179034973977573027349680609443297302734968060944329ca5e73e0cce0a54a805779dfd7d3a975-17903502877661985770889.jpg)

![Phú Thọ: Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan- Ảnh 7.](https://baoxaydung.mediacdn.vn/thumb_w/780/603483875699699712/2026/9/25/179034973974773027349680609443297302734968060944329da32fe129c5384a204d2837410ed83c7-17903502876511907989274.jpg)

![Phú Thọ: Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng, cảnh quan- Ảnh 8.](https://baoxaydung.mediacdn.vn/603483875699699712/2026/9/25/17903497397587302734968060944329730273496806094432908bd9b472063f4cdcc771e04b57cf47d-1790350287664946393339.jpg "Chính quyền xã Yên Lạc luôn nỗ lực thực hiện tốt công tác giải phóng mặt bằng.")

**Dự án Khu đô thị Yên Lạc - Dragon City được Sở Xây dựng tỉnh Phú Thọ cho phép huy động vốn**

Theo thông báo số 1653/SXD-QLN&TTBĐS của Sở Xây dựng ban hành ngày 13 tháng 02 năm 2026, xác nhận đủ điều kiện huy động vốn với dự án Khu đô thị Yên Lạc - Dragon City phân kỳ 1 thông qua góp vốn, hợp tác đầu tư, kinh doanh, liên doanh, liên kết của các cá nhân, tổ chức.

Cùng với quá trình hoàn thiện hạ tầng kỹ thuật, cảnh quan và không gian đô thị, đây được xem là một trong những tiền đề quan trọng để Yên Lạc - Dragon City từng bước hiện thực hóa định hướng trở thành một khu đô thị hiện đại, đồng bộ tại khu vực Yên Lạc.$news$,
  'published',
  'Khu đô thị Yên Lạc - Dragon City tăng tốc hoàn thiện hạ tầng',
  'Sau khi hoàn thiện thủ tục pháp lý về đầu tư, Khu đô thị Yên Lạc - Dragon City (Phú Thọ) đang tăng tốc hoàn thiện hạ tầng kỹ thuật, cây xanh và cảnh quan.',
  '2026-09-26T08:57:00+07:00'
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
where slug = 'phu-tho-khu-do-thi-yen-lac-dragon-city-tang-toc-hoan-thien-ha-tang-canh-quan';
