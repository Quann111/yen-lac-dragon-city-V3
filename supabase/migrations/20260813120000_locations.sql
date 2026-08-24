-- Bảng lưu danh sách tỉnh/thành phố Việt Nam
create table if not exists public.locations (
  id bigserial primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Insert 63 tỉnh/thành phố Việt Nam
insert into public.locations (name) values
('An Giang'), ('Bà Rịa - Vũng Tàu'), ('Bắc Giang'), ('Bắc Kạn'),
('Bạc Liêu'), ('Bắc Ninh'), ('Bến Tre'), ('Bình Định'),
('Bình Dương'), ('Bình Phước'), ('Bình Thuận'), ('Cà Mau'),
('Cao Bằng'), ('Đắk Lắk'), ('Đắk Nông'), ('Điện Biên'),
('Đồng Nai'), ('Đồng Tháp'), ('Gia Lai'), ('Hà Giang'),
('Hà Nam'), ('Hà Nội'), ('Hà Tĩnh'), ('Hải Dương'),
('Hải Phòng'), ('Hậu Giang'), ('Hòa Bình'), ('Hưng Yên'),
('Khánh Hòa'), ('Kiên Giang'), ('Kon Tum'), ('Lai Châu'),
('Lâm Đồng'), ('Lạng Sơn'), ('Lào Cai'), ('Long An'),
('Nam Định'), ('Nghệ An'), ('Ninh Bình'), ('Ninh Thuận'),
('Phú Thọ'), ('Phú Yên'), ('Quảng Bình'), ('Quảng Nam'),
('Quảng Ngãi'), ('Quảng Ninh'), ('Quảng Trị'), ('Sóc Trăng'),
('Sơn La'), ('Tây Ninh'), ('Thái Bình'), ('Thái Nguyên'),
('Thanh Hóa'), ('Thừa Thiên Huế'), ('Tiền Giang'), ('Trà Vinh'),
('Tuyên Quang'), ('Vĩnh Long'), ('Vĩnh Phúc'), ('Vũng Tàu'),
('Yên Bái'), ('Đà Nẵng'), ('Hồ Chí Minh')
on conflict (name) do nothing;

-- Bật RLS
alter table public.locations enable row level security;

-- Policy: ai cũng có thể đọc danh sách tỉnh
do $$ begin
  create policy "locations_select_all" on public.locations
    for select using (true);
exception when duplicate_object then null;
end $$;

-- Policy: admin có thể thêm/sửa/xóa locations
do $$ begin
  create policy "locations_manage_admin" on public.locations
    for all using (
      exists (select 1 from public.recruitment_admins where user_id = auth.uid())
    );
exception when duplicate_object then null;
end $$;
