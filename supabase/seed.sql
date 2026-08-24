insert into public.jobs (
  title, slug, department, location, employment_type, quantity, salary_text,
  summary, description, requirements, benefits, deadline, status, published_at,
  seo_title, seo_description
) values (
  'Chuyên viên Kinh doanh Bất động sản',
  'chuyen-vien-kinh-doanh-bat-dong-san',
  'Kinh doanh',
  'Phú Thọ',
  'Toàn thời gian',
  5,
  'Lương cứng + hoa hồng cạnh tranh',
  'Tìm kiếm và tư vấn khách hàng quan tâm tới các sản phẩm thuộc dự án Yên Lạc Dragon City.',
  '- Tư vấn sản phẩm và chính sách bán hàng cho khách hàng.\n- Chăm sóc khách hàng trước, trong và sau giao dịch.\n- Phối hợp cùng đội ngũ marketing triển khai các chương trình kinh doanh.',
  '- Giao tiếp tốt, chủ động và có tinh thần trách nhiệm.\n- Ưu tiên ứng viên có kinh nghiệm kinh doanh hoặc bất động sản.\n- Có khả năng làm việc độc lập và theo nhóm.',
  '- Thu nhập theo năng lực và chính sách hoa hồng hấp dẫn.\n- Được đào tạo kiến thức sản phẩm và kỹ năng bán hàng.\n- Môi trường làm việc chuyên nghiệp, nhiều cơ hội phát triển.',
  current_date + 60,
  'published',
  now(),
  'Tuyển Chuyên viên Kinh doanh Bất động sản',
  'Cơ hội trở thành Chuyên viên Kinh doanh tại dự án Yên Lạc Dragon City.'
)
on conflict (slug) do nothing;

insert into public.jobs (
  title, slug, department, location, employment_type, quantity, salary_text,
  summary, description, requirements, benefits, deadline, status, published_at,
  seo_title, seo_description
) values (
  'Chuyên viên Marketing Online',
  'chuyen-vien-marketing-online',
  'Marketing',
  'Hà Nội',
  'Toàn thời gian',
  2,
  '12 - 18 triệu',
  'Quản lý kênh digital marketing, chạy quảng cáo và xây dựng nội dung truyền thông cho dự án.',
  '- Lập kế hoạch và triển khai chiến dịch marketing trên Facebook, Google, TikTok.\n- Sản xuất nội dung sáng tạo: hình ảnh, video, bài viết.\n- Phân tích hiệu quả chiến dịch và báo cáo định kỳ.\n- Phối hợp với đội ngũ kinh doanh để tối ưu chuyển đổi.',
  '- Tối thiểu 2 năm kinh nghiệm Marketing Online / Digital Marketing.\n- Thành thạo Facebook Ads, Google Ads, TikTok Ads.\n- Biết sử dụng Canva, Premiere hoặc các công cụ thiết kế cơ bản.\n'- Có tư duy sáng tạo và khả năng phân tích dữ liệu.',
  '- Mức lương cạnh tranh + thưởng theo KPI.\n- Môi trường trẻ trung, năng động.\n- Đào tạo nâng cao kỹ năng chuyên môn.\n- Du lịch teambuilding hàng năm.',
  current_date + 45,
  'published',
  now(),
  'Tuyển Chuyên viên Marketing Online - Hà Nội',
  'Cơ hội việc làm Chuyên viên Marketing Online tại Hà Nội, dự án Yên Lạc Dragon City.'
)
on conflict (slug) do nothing;

