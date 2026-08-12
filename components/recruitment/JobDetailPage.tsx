import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, FileText, MapPin, Upload, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDate, Job } from '../../lib/recruitment';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import MarkdownContent from './MarkdownContent';

const acceptedCvTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const JobDetailPage: React.FC = () => {
  const { slug } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [cv, setCv] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadJob = async () => {
      if (!isSupabaseConfigured) {
        setError('Hệ thống tuyển dụng đang được cấu hình.');
        setLoading(false);
        return;
      }
      const { data, error: loadError } = await supabase.from('jobs').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
      if (loadError || !data) setError('Vị trí này không tồn tại hoặc đã ngừng tuyển dụng.');
      else {
        const loadedJob = data as Job;
        if (loadedJob.deadline && new Date(loadedJob.deadline) < new Date()) setError('Vị trí này đã hết hạn ứng tuyển.');
        else {
          setJob(loadedJob);
          document.title = `${loadedJob.seo_title || loadedJob.title} | Tuyển dụng D-Park`;
        }
      }
      setLoading(false);
    };
    loadJob();
  }, [slug]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    if (!job || !cv) {
      setSubmitError('Vui lòng chọn CV trước khi gửi.');
      return;
    }
    if (!acceptedCvTypes.includes(cv.type) || cv.size > 5 * 1024 * 1024) {
      setSubmitError('CV phải là PDF, DOC hoặc DOCX và không vượt quá 5 MB.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    formData.set('job_id', job.id);
    formData.set('cv', cv);

    const { data, error: invokeError } = await supabase.functions.invoke('submit-application', { body: formData });
    if (invokeError || !data?.ok) setSubmitError(data?.message || 'Chưa thể gửi hồ sơ. Vui lòng thử lại sau.');
    else {
      setSubmitted(true);
      formRef.current?.reset();
      setCv(null);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen pt-32 text-center text-gray-500">Đang tải thông tin vị trí...</div>;
  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 px-6 text-center">
        <BriefcaseBusiness size={56} className="mx-auto text-gray-300" />
        <h1 className="mt-5 text-3xl font-bold text-royal-900">Không thể mở vị trí</h1>
        <p className="mt-3 text-gray-600">{error}</p>
        <Link to="/tuyen-dung" className="mt-7 inline-flex items-center gap-2 rounded-full bg-royal-600 px-6 py-3 text-white"><ArrowLeft size={18} /> Danh sách tuyển dụng</Link>
      </div>
    );
  }

  const inputClass = 'mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-royal-500 focus:ring-2 focus:ring-royal-100';

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-body">
      <div className="container mx-auto px-6">
        <Link to="/tuyen-dung" className="inline-flex items-center gap-2 text-sm font-semibold text-royal-600 hover:text-gold-600"><ArrowLeft size={17} /> Quay lại danh sách</Link>
        <header className="mt-6 rounded-3xl bg-gradient-to-br from-royal-900 to-royal-600 px-7 py-10 md:px-12 text-white shadow-xl">
          <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-wider text-gold-300">{job.department}</span>
          <h1 className="mt-5 text-3xl md:text-5xl font-plus font-semibold">{job.title}</h1>
          <p className="mt-4 max-w-3xl text-white/80 text-lg leading-8">{job.summary}</p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
            <span className="inline-flex gap-2"><MapPin size={18} />{job.location}</span>
            <span className="inline-flex gap-2"><Clock3 size={18} />{job.employment_type}</span>
            <span className="inline-flex gap-2"><Users size={18} />{job.quantity} vị trí</span>
            <span className="inline-flex gap-2"><CalendarDays size={18} />Hạn {formatDate(job.deadline)}</span>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] items-start">
          <article className="rounded-3xl bg-white p-7 md:p-10 shadow-sm border border-gray-100 space-y-10">
            {job.salary_text && <div className="rounded-2xl bg-gold-50 border border-gold-200 px-5 py-4"><strong className="text-gold-800">Thu nhập:</strong> {job.salary_text}</div>}
            <section><h2 className="mb-5 text-2xl font-bold text-royal-900">Mô tả công việc</h2><MarkdownContent content={job.description} /></section>
            <section><h2 className="mb-5 text-2xl font-bold text-royal-900">Yêu cầu ứng viên</h2><MarkdownContent content={job.requirements} /></section>
            <section><h2 className="mb-5 text-2xl font-bold text-royal-900">Quyền lợi</h2><MarkdownContent content={job.benefits} /></section>
          </article>

          <aside className="lg:sticky lg:top-24 rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-royal-900">Ứng tuyển ngay</h2>
            <p className="mt-2 text-sm text-gray-500">CV của bạn được bảo mật và chỉ HR có quyền truy cập.</p>
            {submitted ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-emerald-800">
                <CheckCircle2 size={32} />
                <h3 className="mt-3 font-bold">Đã nhận hồ sơ</h3>
                <p className="mt-1 text-sm">Cảm ơn bạn đã ứng tuyển. Bộ phận tuyển dụng sẽ liên hệ khi hồ sơ phù hợp.</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-semibold text-gray-700">Họ và tên *<input name="full_name" required maxLength={120} className={inputClass} /></label>
                <label className="block text-sm font-semibold text-gray-700">Email *<input name="email" type="email" required maxLength={160} className={inputClass} /></label>
                <label className="block text-sm font-semibold text-gray-700">Số điện thoại *<input name="phone" type="tel" required pattern="[0-9+() .-]{8,20}" className={inputClass} /></label>
                <label className="block text-sm font-semibold text-gray-700">Nơi ở hiện tại *<input name="current_location" required maxLength={180} className={inputClass} /></label>
                <label className="block text-sm font-semibold text-gray-700">Portfolio/LinkedIn<input name="portfolio_url" type="url" maxLength={500} className={inputClass} /></label>
                <label className="block text-sm font-semibold text-gray-700">Thư giới thiệu<textarea name="cover_letter" maxLength={3000} rows={4} className={inputClass} /></label>
                <label className="block text-sm font-semibold text-gray-700">CV *
                  <span className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-royal-200 bg-royal-50/40 p-5 text-center text-royal-700 hover:border-royal-500">
                    {cv ? <><FileText size={20} />{cv.name}</> : <><Upload size={20} />Chọn PDF, DOC hoặc DOCX</>}
                    <input name="cv" type="file" required accept=".pdf,.doc,.docx" className="sr-only" onChange={(event) => setCv(event.target.files?.[0] || null)} />
                  </span>
                </label>
                <label className="flex items-start gap-3 text-xs text-gray-600"><input name="consent" value="yes" type="checkbox" required className="mt-0.5 h-4 w-4 accent-royal-600" />Tôi đồng ý để D-Park xử lý thông tin và CV cho mục đích tuyển dụng.</label>
                <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                {submitError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
                <button disabled={submitting} className="w-full rounded-xl bg-royal-600 px-5 py-3.5 font-bold text-white transition hover:bg-royal-700 disabled:opacity-60">{submitting ? 'Đang gửi hồ sơ...' : 'Gửi hồ sơ ứng tuyển'}</button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
