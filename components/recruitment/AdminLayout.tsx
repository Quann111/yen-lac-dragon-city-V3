import React from 'react';
import { BriefcaseBusiness, LogOut, Users } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut({ scope: 'local' });
    navigate('/admin/dang-nhap', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-body">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-royal-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div><p className="text-xs uppercase tracking-[0.25em] text-gold-400">D-Park</p><h1 className="font-bold">Quản trị tuyển dụng</h1></div>
          <nav className="flex items-center gap-2">
            <NavLink to="/admin/tuyen-dung" className={({ isActive }) => `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${isActive ? 'bg-white text-royal-900' : 'text-white/80 hover:bg-white/10'}`}><BriefcaseBusiness size={17} /> Vị trí</NavLink>
            <NavLink to="/admin/ung-vien" className={({ isActive }) => `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${isActive ? 'bg-white text-royal-900' : 'text-white/80 hover:bg-white/10'}`}><Users size={17} /> Ứng viên</NavLink>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"><LogOut size={17} /> <span className="hidden sm:inline">Đăng xuất</span></button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8"><Outlet /></main>
    </div>
  );
};

export default AdminLayout;
