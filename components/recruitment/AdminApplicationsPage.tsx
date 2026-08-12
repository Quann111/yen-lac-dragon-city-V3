import React, { useEffect, useMemo, useState } from 'react';
import { Download, Eye, Search, Trash2, X } from 'lucide-react';
import { Application, applicationStatusLabels, ApplicationStatus, formatDate, Job } from '../../lib/recruitment';
import { supabase } from '../../lib/supabase';

const statuses = Object.keys(applicationStatusLabels) as ApplicationStatus[];

const AdminApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [applicationResult, jobsResult] = await Promise.all([
      supabase.from('applications').select('*, jobs(id,title,slug)').order('created_at', { ascending: false }),
      supabase.from('jobs').select('*').order('title'),
    ]);
    if (applicationResult.error) setMessage(applicationResult.error.message);
    else setApplications((applicationResult.data || []) as unknown as Application[]);
    if (!jobsResult.error) setJobs((jobsResult.data || []) as Job[]);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => applications.filter((item) => {
    const text = `${item.full_name} ${item.email} ${item.phone}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase()))
      && (!statusFilter || item.status === statusFilter)
      && (!jobFilter || item.job_id === jobFilter)
      && (!dateFilter || item.created_at.slice(0, 10) === dateFilter);
  }), [applications, query, statusFilter, jobFilter, dateFilter]);

  const counts = useMemo(() => statuses.reduce((result, status) => ({ ...result, [status]: applications.filter((item) => item.status === status).length }), {} as Record<ApplicationStatus, number>), [applications]);

  const updateApplication = async (id: string, values: Partial<Pick<Application, 'status' | 'internal_notes'>>) => {
    const { error } = await supabase.from('applications').update(values).eq('id', id);
    if (error) setMessage(error.message);
    else {
      setApplications((items) => items.map((item) => item.id === id ? { ...item, ...values } : item));
      setSelected((item) => item?.id === id ? { ...item, ...values } : item);
    }
  };

  const downloadCv = async (item: Application) => {
    const { data, error } = await supabase.storage.from('recruitment-cvs').createSignedUrl(item.cv_path, 60);
    if (error || !data?.signedUrl) setMessage('Không thể tạo liên kết tải CV.');
    else window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const deleteApplication = async (item: Application) => {
    if (!window.confirm(`Xóa hồ sơ của ${item.full_name}? Thao tác này không thể hoàn tác.`)) return;
    const { data, error } = await supabase.functions.invoke('delete-application', { body: { application_id: item.id } });
    if (error || !data?.ok) setMessage(data?.message || 'Không thể xóa hồ sơ.');
    else {
      setSelected(null);
      setApplications((items) => items.filter((candidate) => candidate.id !== item.id));
    }
  };

  return (
    <div>
      <div><h2 className="text-2xl font-bold text-royal-900">Hồ sơ ứng viên</h2><p className="text-sm text-gray-500">Theo dõi và cập nhật quá trình tuyển chọn.</p></div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {statuses.map((status) => <button key={status} onClick={() => setStatusFilter(statusFilter === status ? '' : status)} className={`rounded-2xl border p-4 text-left shadow-sm ${statusFilter === status ? 'border-royal-500 bg-royal-50' : 'border-gray-100 bg-white'}`}><span className="text-xs uppercase tracking-wider text-gray-500">{applicationStatusLabels[status]}</span><strong className="mt-1 block text-2xl text-royal-900">{counts[status] || 0}</strong></button>)}
      </div>
      <div className="mt-5 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-4">
        <label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tên, email, điện thoại..." className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 outline-none focus:border-royal-500" /></label>
        <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 bg-white"><option value="">Tất cả vị trí</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 bg-white"><option value="">Tất cả trạng thái</option>{statuses.map((status) => <option key={status} value={status}>{applicationStatusLabels[status]}</option>)}</select>
        <input aria-label="Lọc theo ngày nộp" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5" />
      </div>
      {message && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-amber-800">{message}</p>}
      <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-royal-50 text-royal-900"><tr><th className="p-4">Ứng viên</th><th className="p-4">Vị trí</th><th className="p-4">Ngày nộp</th><th className="p-4">Trạng thái</th><th className="p-4">Email</th><th className="p-4 text-right">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Đang tải hồ sơ...</td></tr>}
            {!loading && filtered.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="p-4"><p className="font-bold text-gray-900">{item.full_name}</p><p className="text-xs text-gray-500">{item.phone}</p></td><td className="p-4">{item.jobs?.title || 'Vị trí đã xóa'}</td><td className="p-4">{formatDate(item.created_at)}</td><td className="p-4"><select value={item.status} onChange={(e) => updateApplication(item.id, { status: e.target.value as ApplicationStatus })} className="rounded-lg border border-gray-200 px-2 py-1.5 bg-white">{statuses.map((status) => <option key={status} value={status}>{applicationStatusLabels[status]}</option>)}</select></td><td className="p-4">{item.notification_status === 'failed' ? <span className="text-red-600">Gửi mail lỗi</span> : item.email}</td><td className="p-4"><div className="flex justify-end gap-2"><button title="Xem hồ sơ" onClick={() => setSelected(item)} className="rounded-lg p-2 hover:bg-royal-50 hover:text-royal-600"><Eye size={17} /></button><button title="Tải CV" onClick={() => downloadCv(item)} className="rounded-lg p-2 hover:bg-royal-50 hover:text-royal-600"><Download size={17} /></button><button title="Xóa" onClick={() => deleteApplication(item)} className="rounded-lg p-2 hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button></div></td></tr>)}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Không có hồ sơ phù hợp.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"><div className="mx-auto my-8 max-w-2xl rounded-3xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b px-6 py-4"><div><h3 className="text-xl font-bold text-royal-900">{selected.full_name}</h3><p className="text-sm text-gray-500">{selected.jobs?.title}</p></div><button onClick={() => setSelected(null)} className="rounded-full p-2 hover:bg-gray-100"><X /></button></div><div className="p-6 space-y-5"><div className="grid gap-4 sm:grid-cols-2 text-sm"><div><span className="text-gray-400">Email</span><p className="font-semibold">{selected.email}</p></div><div><span className="text-gray-400">Điện thoại</span><p className="font-semibold">{selected.phone}</p></div><div><span className="text-gray-400">Nơi ở</span><p className="font-semibold">{selected.current_location}</p></div><div><span className="text-gray-400">Ngày nộp</span><p className="font-semibold">{formatDate(selected.created_at)}</p></div></div>{selected.portfolio_url && <a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-royal-600 underline">Mở Portfolio/LinkedIn</a>}{selected.cover_letter && <div><h4 className="font-bold text-royal-900">Thư giới thiệu</h4><p className="mt-2 whitespace-pre-wrap text-gray-600">{selected.cover_letter}</p></div>}<label className="block text-sm font-semibold">Trạng thái<select value={selected.status} onChange={(e) => updateApplication(selected.id, { status: e.target.value as ApplicationStatus })} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5">{statuses.map((status) => <option key={status} value={status}>{applicationStatusLabels[status]}</option>)}</select></label><label className="block text-sm font-semibold">Ghi chú nội bộ<textarea rows={5} value={selected.internal_notes || ''} onChange={(e) => setSelected({ ...selected, internal_notes: e.target.value })} onBlur={() => updateApplication(selected.id, { internal_notes: selected.internal_notes })} className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-royal-500" /></label><div className="flex flex-wrap justify-between gap-3 border-t pt-5"><button onClick={() => deleteApplication(selected)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-red-600"><Trash2 size={17} /> Xóa hồ sơ</button><button onClick={() => downloadCv(selected)} className="inline-flex items-center gap-2 rounded-xl bg-royal-600 px-5 py-2.5 font-bold text-white"><Download size={17} /> Tải CV</button></div></div></div></div>}
    </div>
  );
};

export default AdminApplicationsPage;
