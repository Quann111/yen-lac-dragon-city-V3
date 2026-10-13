-- Nới giới hạn độ dài tiêu đề bài viết từ 160 lên 250 ký tự.
-- Tiêu đề các văn bản pháp lý (vd: "V/v công khai thông tin huy động vốn ... dự án khu đô thị Yên Lạc – Dragon City") dài ~200 ký tự.
alter table public.news_posts drop constraint if exists news_posts_title_check;
alter table public.news_posts add constraint news_posts_title_check check (char_length(title) between 3 and 250);
