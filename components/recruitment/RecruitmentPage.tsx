import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, MapPin, Search, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../../image/optimized/TT006_optimized.avif';
import { formatDate, Job } from '../../lib/recruitment';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

const RecruitmentPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Tuyển dụng | Yên Lạc Dragon City';

    const loadJobs = async () => {
      if (!isSupabaseConfigured) {
        setError('Hệ thống tuyển dụng đang được cấu hình. Vui lòng quay lại sau.');
        setLoading(false);
        return;
      }
      const { data, error: loadError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (loadError) setError('Chưa thể tải danh sách tuyển dụng. Vui lòng thử lại sau.');
      else setJobs((data || []) as Job[]);
      setLoading(false);
    };

    loadJobs();
  }, []);

  const options = useMemo(() => ({
    departments: [...new Set(jobs.map((job) => job.department))],
    locations: [...new Set(jobs.map((job) => job.location))],
    employmentTypes: [...new Set(jobs.map((job) => job.employment_type))],
  }), [jobs]);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const normalizedQuery = query.trim().toLowerCase();
    return (!normalizedQuery || `${job.title} ${job.summary}`.toLowerCase().includes(normalizedQuery))
      && (!department || job.department === department)
      && (!location || job.location === location)
      && (!employmentType || job.employment_type === employmentType);
  }), [jobs, query, department, location, employmentType]);

  return (
    <div className="bg-slate-50 min-h-screen pt-16 font-body">
      <section className="relative min-h-[540px] flex items-center overflow-hidden">
        <img src={heroImage} alt="Cơ hội nghề nghiệp tại D-Park" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-royal-900 via-royal-900/90 to-royal-800/30" />
        <div className="relative container mx-auto px-6 py-24 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-gold-300 backdrop-blur">
            <Sparkles size={16} /> Đồng hành cùng D-Park
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl md:text-6xl font-plus font-semibold leading-tight">Cùng kiến tạo những giá trị bền vững</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80 leading-8">Chúng tôi tìm kiếm những người đồng đội tận tâm, sáng tạo và sẵn sàng cùng phát triển những không gian sống đáng tự hào.</p>
          <a href="#vi-tri-dang-tuyen" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 font-semibold text-royal-900 transition hover:bg-gold-400">
            Khám phá cơ hội <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [Users, 'Con người là trọng tâm', 'Tôn trọng khác biệt và cùng nhau phát triển.'],
            [Sparkles, 'Khuyến khích sáng tạo', 'Mỗi ý tưởng tốt đều có cơ hội trở thành giá trị thật.'],
            [Building2, 'Dự án giàu dấu ấn', 'Góp phần kiến tạo những công trình có giá trị lâu dài.'],
          ].map(([Icon, title, text]) => {
            const CardIcon = Icon as typeof Users;
            return (
              <article key={title as string} className="rounded-3xl bg-white border border-royal-100 p-7 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-royal-50 text-royal-600"><CardIcon /></div>
                <h2 className="text-xl font-bold text-royal-900">{title as string}</h2>
                <p className="mt-2 text-gray-600 leading-7">{text as string}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="vi-tri-dang-tuyen" className="container mx-auto px-6 pb-24 scroll-mt-24">
        <div className="text-center mb-10">
          <p className="text-gold-600 uppercase tracking-[0.25em] text-sm font-bold">Cơ hội nghề nghiệp</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-plus font-semibold text-royal-900">Vị trí đang tuyển dụng</h2>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 grid gap-4 lg:grid-cols-4 mb-8">
          <label className="relative lg:col-span-1">
            <span className="sr-only">Tìm kiếm vị trí</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm vị trí..." className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-royal-500" />
          </label>
          {[
            ['Phòng ban', department, setDepartment, options.departments],
            ['Địa điểm', location, setLocation, options.locations],
            ['Loại hình', employmentType, setEmploymentType, options.employmentTypes],
          ].map(([label, value, setter, values]) => (
            <select key={label as string} aria-label={label as string} value={value as string} onChange={(event) => (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-royal-500 bg-white">
              <option value="">Tất cả {String(label).toLowerCase()}</option>
              {(values as string[]).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          ))}
        </div>

        {loading && <div className="py-20 text-center text-gray-500">Đang tải vị trí tuyển dụng...</div>}
        {!loading && error && <div className="rounded-2xl bg-amber-50 border border-amber-200 p-8 text-center text-amber-800">{error}</div>}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="rounded-3xl bg-white border border-dashed border-gray-300 py-16 text-center">
            <BriefcaseBusiness className="mx-auto text-gray-300" size={48} />
            <h3 className="mt-4 text-xl font-bold text-royal-900">Chưa có vị trí phù hợp</h3>
            <p className="mt-2 text-gray-500">Hãy điều chỉnh bộ lọc hoặc quay lại trong thời gian tới.</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <article key={job.id} className="group rounded-3xl bg-white border border-gray-100 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="rounded-full bg-royal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-royal-700">{job.department}</span>
                <span className="text-sm text-gray-500">Hạn: {formatDate(job.deadline)}</span>
              </div>
              <h3 className="mt-5 text-2xl font-bold text-royal-900 group-hover:text-royal-600">{job.title}</h3>
              <p className="mt-3 text-gray-600 leading-7 line-clamp-2">{job.summary}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5"><MapPin size={16} />{job.location}</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 size={16} />{job.employment_type}</span>
                <span className="inline-flex items-center gap-1.5"><Users size={16} />{job.quantity} người</span>
              </div>
              <Link to={`/tuyen-dung/${job.slug}`} className="mt-6 inline-flex items-center gap-2 font-bold text-royal-600 hover:text-gold-600">
                Xem chi tiết <ArrowRight size={18} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RecruitmentPage;

