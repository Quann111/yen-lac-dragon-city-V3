
# Hệ thống tuyển dụng

## Cấu hình frontend

Sao chép `.env.example` thành `.env.local` và điền:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Chỉ dùng publishable key ở frontend. Không đặt database password, secret key hay Resend API key trong biến `VITE_*`.

## Khởi tạo Supabase

CLI được kiểm tra với phiên bản `2.114.0`:

```bash
npx --yes supabase@2.114.0 login
npx --yes supabase@2.114.0 link --project-ref uzbbwbtvkurlynrxocqc
npx --yes supabase@2.114.0 db push
```

Migration tạo các bảng `jobs`, `applications`, `recruitment_admins`, RLS policies và bucket private `recruitment-cvs`.

Tạo tài khoản HR trong Supabase Auth, sau đó thêm quyền bằng SQL Editor:

```sql
insert into public.recruitment_admins (user_id)
values ('UUID_CUA_AUTH_USER');
```

## Email và Edge Functions

Cấu hình secrets, trong đó `RECRUITMENT_FROM_EMAIL` phải thuộc domain đã xác minh với Resend:

```bash
npx --yes supabase@2.114.0 secrets set RESEND_API_KEY=... RECRUITMENT_FROM_EMAIL="D-Park Recruitment <tuyendung@your-verified-domain.vn>" RECRUITMENT_TO_EMAIL=tuyendung@d-park.com.vn SITE_URL=https://www.yenlac-dragoncity.com.vn
npx --yes supabase@2.114.0 functions deploy submit-application
npx --yes supabase@2.114.0 functions deploy delete-application
```

`submit-application` là endpoint công khai nhưng tự kiểm tra job, dữ liệu và CV. `delete-application` yêu cầu phiên đăng nhập và quyền trong `recruitment_admins`.

## Route

- `/#/tuyen-dung`: danh sách vị trí.
- `/#/tuyen-dung/:slug`: chi tiết và form ứng tuyển.
- `/#/admin/dang-nhap`: đăng nhập HR.
- `/#/admin/tuyen-dung`: quản lý vị trí.
- `/#/admin/ung-vien`: quản lý hồ sơ.
