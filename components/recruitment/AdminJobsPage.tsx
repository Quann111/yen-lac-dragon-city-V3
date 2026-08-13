import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { generateSlug, Job, jobStatusLabels, JobStatus } from '../../lib/recruitment';
import { supabase } from '../../lib/supabase';
import MarkdownContent from './MarkdownContent';

type JobForm = Omit<Job, 'id' | 'created_at' | 'updated_at' | 'published_at'>;

const VIETNAM_LOCATIONS = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh',
  'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau',
  'Cao Bằng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
  'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng',
  'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum',
  'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
  'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam',
  'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh',
  'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh',
  'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái', 'Đà Nẵng', 'Hồ Chí Minh',
];

const emptyForm: JobForm = {
  title: '', slug: '', department: '', location: '', employment_type: 'Toàn thời gian', quantity: 1,
  salary_text: '', summary: '', description: '', requirements: '', benefits: '', deadline: '', status: 'draft',
  seo_title: '', seo_description: '',
};

const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);
  const [preview, setPreview] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (error) setMessage(`Không thể tải dữ liệu: ${error.message}`);
    else setJobs((data || []) as Job[]);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
    supabase.from('locations').select('name').order('name').then(({ data, error }) => {
      if (!error && data && data.length > 0) setLocations(data.map((l: { name: string }) => l.name));
      else setLocations([...VIETNAM_LOCATIONS].sort((a, b) => a.localeCompare(b, 'vi')));
    }).catch(() => setLocations([...VIETNAM_LOCATIONS].sort((a, b) => a.localeCompare(b, 'vi'))));
  }, []);

  const filtered = useMemo(() => jobs.filter((job) => {
    const text = `${job.title} ${job.department}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!statusFilter || job.status === statusFilter);
  }), [jobs, query, statusFilter]);

  const updateField = <K extends keyof JobForm>(field: K, value: JobForm[K]) => setForm((current) => ({ ...current, [field]: value }));
  const updateTitle = (title: string) => setForm((current) => ({ ...current, title, slug: editingId && current.slug ? current.slug : generateSlug(title), seo_title: current.seo_title || title, seo_description: current.seo_description || current.summary }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreview(false);
    setMessage('');
    setFormOpen(true);
  };

  const openEdit = (job: Job) => {
    setEditingId(job.id);
    setForm({
      title: job.title, slug: job.slug, department: job.department, location: job.location,
      employment_type: job.employment_type, quantity: job.quantity, salary_text: job.salary_text || '',
      summary: job.summary, description: job.description, requirements: job.requirements, benefits: job.benefits,
      deadline: job.deadline || '', status: job.status, seo_title: job.seo_title || '', seo_description: job.seo_description || '',
    });
    setPreview(false);
    setMessage('');
    setFormOpen(true);
  };

  const saveJob = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      ...form,
      slug: generateSlug(form.slug),
      deadline: form.deadline || null,
      salary_text: form.salary_text || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
      created_by: user?.id,
    };
    const result = editingId
      ? await supabase.from('jobs').update(payload).eq('id', editingId)
      : await supabase.from('jobs').insert(payload);
    if (result.error) setMessage(result.error.code === '23505' ? 'Slug đã tồn tại. Vui lòng chọn slug khác.' : result.error.message);
    else {
      setFormOpen(false);
      await loadJobs();
    }
    setSaving(false);
  };

  const deleteOrClose = async (job: Job) => {
    const { count } = await supabase.from('applications').select('id', { count: 'exact', head: true }).eq('job_id', job.id);
    if ((count || 0) > 0) {
      if (!window.confirm('Vị trí đã có ứng viên. Chuyển trạng thái sang Đã đóng?')) return;
      await supabase.from('jobs').update({ status: 'closed' }).eq('id', job.id);
    } else {
      if (!window.confirm(`Xóa vị trí “${job.title}”?`)) return;
      await supabase.from('jobs').delete().eq('id', job.id);
    }
    await loadJobs();
  };

  const fieldClass = 'mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none focus:border-royal-500';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-royal-900">Vị trí tuyển dụng</h2><p className="text-sm text-gray-500">Tạo, xuất bản và đóng các vị trí đang tuyển.</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-royal-600 px-5 py-3 font-bold text-white hover:bg-royal-700"><Plus size={18} /> Thêm vị trí</button>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px]">
        <label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên hoặc phòng ban..." className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 outline-none focus:border-royal-500" /></label>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 bg-white"><option value="">Tất cả trạng thái</option><option value="draft">Bản nháp</option><option value="published">Đang tuyển</option><option value="closed">Đã đóng</option></select>
      </div>
      {message && !formOpen && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-amber-800">{message}</p>}
      <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-royal-50 text-royal-900"><tr><th className="p-4">Vị trí</th><th className="p-4">Phòng ban</th><th className="p-4">Trạng thái</th><th className="p-4">Hạn tuyển</th><th className="p-4 text-right">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Đang tải...</td></tr>}
            {!loading && filtered.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50"><td className="p-4"><p className="font-bold text-gray-900">{job.title}</p><p className="text-xs text-gray-400">/{job.slug}</p></td><td className="p-4">{job.department}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${job.status === 'published' ? 'bg-emerald-50 text-emerald-700' : job.status === 'closed' ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-amber-700'}`}>{jobStatusLabels[job.status]}</span></td><td className="p-4">{job.deadline || '—'}</td><td className="p-4"><div className="flex justify-end gap-2">{job.status === 'published' && <button title="Xem công khai" onClick={() => window.open(`#/tuyen-dung/${job.slug}`, '_blank', 'noopener,noreferrer')} className="rounded-lg p-2 text-gray-500 hover:bg-royal-50 hover:text-royal-600"><Eye size={17} /></button>}<button title="Sửa" onClick={() => openEdit(job)} className="rounded-lg p-2 text-gray-500 hover:bg-royal-50 hover:text-royal-600"><Pencil size={17} /></button><button title="Xóa hoặc đóng" onClick={() => deleteOrClose(job)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button></div></td></tr>
            ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Không có vị trí phù hợp.</td></tr>}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="mx-auto my-5 max-w-5xl rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b bg-white px-6 py-4"><div><h3 className="text-xl font-bold text-royal-900">{editingId ? 'Chỉnh sửa vị trí' : 'Tạo vị trí mới'}</h3></div><button onClick={() => setFormOpen(false)} className="rounded-full p-2 hover:bg-gray-100"><X /></button></div>
            <div className="border-b px-6 py-3 flex gap-2"><button onClick={() => setPreview(false)} className={`rounded-lg px-4 py-2 text-sm font-bold ${!preview ? 'bg-royal-600 text-white' : 'bg-gray-100'}`}>Viết</button><button onClick={() => setPreview(true)} className={`rounded-lg px-4 py-2 text-sm font-bold ${preview ? 'bg-royal-600 text-white' : 'bg-gray-100'}`}>Xem trước</button></div>
            {preview ? (
              <div className="p-8 space-y-8"><h1 className="text-4xl font-bold text-royal-900">{form.title || 'Tên vị trí'}</h1><p className="text-lg text-gray-600">{form.summary}</p><section><h2 className="mb-3 text-xl font-bold">Mô tả công việc</h2><MarkdownContent content={form.description || 'Chưa có nội dung'} /></section><section><h2 className="mb-3 text-xl font-bold">Yêu cầu</h2><MarkdownContent content={form.requirements || 'Chưa có nội dung'} /></section><section><h2 className="mb-3 text-xl font-bold">Quyền lợi</h2><MarkdownContent content={form.benefits || 'Chưa có nội dung'} /></section></div>
            ) : (
              <form onSubmit={saveJob} className="p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">Tên vị trí *<input required value={form.title} onChange={(e) => updateTitle(e.target.value)} className={fieldClass} /></label><label className="text-sm font-semibold">Slug *<input required value={form.slug} onChange={(e) => updateField('slug', e.target.value)} className={fieldClass} /></label><label className="text-sm font-semibold">Phòng ban *<input required value={form.department} onChange={(e) => updateField('department', e.target.value)} className={fieldClass} /></label><label className="text-sm font-semibold">Địa điểm *<select required value={form.location} onChange={(e) => updateField('location', e.target.value)} className={fieldClass}><option value="">Chọn địa điểm</option>{locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}</select></label><label className="text-sm font-semibold">Loại hình *<select value={form.employment_type} onChange={(e) => updateField('employment_type', e.target.value)} className={fieldClass}><option>Toàn thời gian</option><option>Bán thời gian</option><option>Thực tập</option><option>Hợp đồng</option></select></label><label className="text-sm font-semibold">Số lượng *<input type="number" min={1} required value={form.quantity} onChange={(e) => updateField('quantity', Number(e.target.value))} className={fieldClass} /></label><label className="text-sm font-semibold">Thu nhập<input value={form.salary_text || ''} onChange={(e) => updateField('salary_text', e.target.value)} className={fieldClass} /></label><label className="text-sm font-semibold">Hạn tuyển<input type="date" value={form.deadline || ''} onChange={(e) => updateField('deadline', e.target.value)} className={fieldClass} /></label></div>
                <label className="block text-sm font-semibold">Mô tả ngắn *<textarea required maxLength={500} rows={3} value={form.summary} onChange={(e) => updateField('summary', e.target.value)} className={fieldClass} /></label>
                {[['description', 'Mô tả công việc'], ['requirements', 'Yêu cầu ứng viên'], ['benefits', 'Quyền lợi']].map(([key, label]) => <label key={key} className="block text-sm font-semibold">{label} *<textarea required rows={8} value={form[key as keyof JobForm] as string} onChange={(e) => updateField(key as 'description' | 'requirements' | 'benefits', e.target.value)} className={`${fieldClass} font-mono text-sm`} /></label>)}
                <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">SEO title <span className="font-normal text-gray-400">({(form.seo_title || '').length}/60)</span><input maxLength={70} value={form.seo_title || ''} onChange={(e) => updateField('seo_title', e.target.value)} className={fieldClass} /></label><label className="text-sm font-semibold">Trạng thái<select value={form.status} onChange={(e) => updateField('status', e.target.value as JobStatus)} className={fieldClass}><option value="draft">Bản nháp</option><option value="published">Đang tuyển</option><option value="closed">Đã đóng</option></select></label></div>
                <label className="block text-sm font-semibold">SEO description <span className="font-normal text-gray-400">({(form.seo_description || '').length}/160)</span><textarea maxLength={180} rows={3} value={form.seo_description || ''} onChange={(e) => updateField('seo_description', e.target.value)} className={fieldClass} /></label>
                {message && <p className="rounded-xl bg-red-50 p-3 text-red-700">{message}</p>}
                <div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border px-5 py-3 font-bold">Hủy</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-royal-600 px-5 py-3 font-bold text-white disabled:opacity-60"><Save size={18} />{saving ? 'Đang lưu...' : 'Lưu vị trí'}</button></div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsPage;
