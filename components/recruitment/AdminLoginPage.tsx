import React, { FormEvent, useEffect, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkRecruitmentAdmin } from '../../lib/recruitment-admin';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectAuthorizedUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const access = await checkRecruitmentAdmin(session.user.id);
      if (access.status === 'authorized') {
        navigate('/admin/tuyen-dung', { replace: true });
        return;
      }
      if (access.status === 'error') {
        setError('Không thể kiểm tra quyền Admin. Vui lòng thử lại hoặc liên hệ quản trị hệ thống.');
      } else {
        setError('Tài khoản không có quyền quản trị tuyển dụng.');
      }
    };
    redirectAuthorizedUser();
  }, [navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    if (!isSupabaseConfigured) {
      setError('Chưa cấu hình kết nối Supabase.');
      setLoading(false);
      return;
    }
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.user) {
      setError('Email hoặc mật khẩu không chính xác.');
      setLoading(false);
      return;
    }
    const access = await checkRecruitmentAdmin(data.user.id);
    if (access.status !== 'authorized') {
      setError(access.status === 'error'
        ? 'Không thể kiểm tra quyền Admin. Vui lòng thử lại hoặc liên hệ quản trị hệ thống.'
        : 'Tài khoản không có quyền quản trị tuyển dụng.');
      setLoading(false);
      return;
    }
    const destination = (location.state as { from?: string } | null)?.from || '/admin/tuyen-dung';
    navigate(destination, { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-royal-900 via-royal-800 to-royal-600 px-5 font-body">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-royal-50 text-royal-600"><LockKeyhole size={28} /></div>
        <h1 className="mt-5 text-center text-2xl font-bold text-royal-900">Đăng nhập quản trị</h1>
        <p className="mt-2 text-center text-sm text-gray-500">Dành cho bộ phận tuyển dụng D-Park</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block text-sm font-semibold text-gray-700">Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-royal-500" /></label>
          <label className="block text-sm font-semibold text-gray-700">Mật khẩu<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-royal-500" /></label>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-royal-600 px-5 py-3 font-bold text-white hover:bg-royal-700 disabled:opacity-60">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
