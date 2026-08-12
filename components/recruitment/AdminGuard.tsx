import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { checkRecruitmentAdmin } from '../../lib/recruitment-admin';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

const AdminGuard: React.FC = () => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const checkAccess = async () => {
      if (!isSupabaseConfigured) {
        if (active) setChecking(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (active) setChecking(false);
        return;
      }
      const access = await checkRecruitmentAdmin(session.user.id);
      if (active) {
        setAuthorized(access.status === 'authorized');
        setAccessError(access.status === 'error');
        setChecking(false);
      }
    };
    checkAccess();
    return () => { active = false; };
  }, [location.pathname]);

  if (checking) return <div className="min-h-screen grid place-items-center bg-slate-100 text-gray-500">Đang kiểm tra quyền truy cập...</div>;
  if (accessError) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-100 px-5 text-center">
        <div className="max-w-md rounded-2xl bg-white p-7 shadow-sm">
          <h1 className="text-xl font-bold text-royal-900">Không thể kiểm tra quyền Admin</h1>
          <p className="mt-2 text-sm text-gray-600">Vui lòng tải lại trang hoặc liên hệ quản trị hệ thống để kiểm tra cấu hình Supabase.</p>
        </div>
      </div>
    );
  }
  if (!authorized) return <Navigate to="/admin/dang-nhap" replace state={{ from: location.pathname }} />;
  return <Outlet />;
};

export default AdminGuard;
