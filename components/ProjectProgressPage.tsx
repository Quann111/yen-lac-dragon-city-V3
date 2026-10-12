import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Phone } from 'lucide-react';

const imgModules = import.meta.glob('../image/optimized/tien-do/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const asset = (name: string) => imgModules[`../image/optimized/tien-do/${name}.webp`];
const full = (n: number) => asset(`p${n}`);
const thumb = (n: number) => asset(`t${n}`);
const videoUrl = (name: string) => `${import.meta.env.BASE_URL}video/${name}`;

const videos = [
  { id: 'tvc', label: 'TVC giới thiệu', meta: '3:55', src: 'tvc.mp4', poster: asset('poster-tvc') },
  { id: 't38', label: 'Teaser tiện ích', meta: '0:38', src: 'teaser-38s.mp4', poster: asset('poster-38') },
  { id: 't48', label: 'Teaser vị trí', meta: '0:48', src: 'teaser-48s.mp4', poster: asset('poster-48') },
];

const stages = [
  { key: 'tong-the', short: 'Tổng thể', title: 'Tổng thể 39ha', desc: 'Khu đô thị quy mô hơn 39ha với quảng trường trung tâm, sân vận động, công viên và hệ thống nhà ở đồng bộ.', images: [8, 19, 20, 2] },
  { key: 'vi-tri', short: 'Vị trí', title: 'Vị trí & giao thông', desc: 'Cửa ngõ giao thông chiến lược, tiếp giáp các trục DT-303, DT-304, DT-305, kết nối nhanh tới Vĩnh Yên và Hà Nội.', images: [18, 17, 16] },
  { key: 'cong-chao', short: 'Quảng trường', title: 'Cổng chào & quảng trường', desc: 'Tháp đồng hồ biểu tượng cùng quảng trường đài phun nước là trái tim của khu đô thị, sôi động cả ngày lẫn đêm.', images: [3, 4, 6, 15] },
  { key: 'san-pham', short: 'Sản phẩm', title: 'Đa dạng sản phẩm', desc: 'Dãy nhà phố, shophouse, biệt thự song lập và tổ hợp chung cư đáp ứng nhu cầu ở và kinh doanh.', images: [5, 14, 13, 7] },
  { key: 'tien-ich', short: 'Tiện ích', title: 'Tiện ích đồng bộ', desc: 'Hồ bơi, trường học, sân thể thao và không gian xanh ngay trong khu, phục vụ trọn vẹn đời sống cư dân.', images: [10, 11, 12, 9] },
  { key: 'phao-hoa', short: 'Đêm hội', title: 'Đêm pháo hoa rực rỡ', desc: 'Dragon City về đêm – nơi những sự kiện văn hoá, thương mại và lễ hội được thắp sáng.', images: [1] },
];

const gallery = stages.flatMap((s) => s.images.map((n) => ({ n, stage: s.key })));

const ProjectProgressPage: React.FC = () => {
  const [videoIdx, setVideoIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const list = gallery.filter((g) => filter === 'all' || g.stage === filter);
  const video = videos[videoIdx];

  const step = useCallback(
    (d: number) => setLightbox((i) => (i === null ? i : (i + d + list.length) % list.length)),
    [list.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, step]);

  const openByImage = (n: number) => {
    setFilter('all');
    setLightbox(gallery.findIndex((g) => g.n === n));
  };

  return (
    <main className="bg-white text-gray-700">
      {/* Hero */}
      <section className="relative flex min-h-[56vh] items-end overflow-hidden pt-28 md:min-h-[64vh]">
        <img src={full(17)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-900/90 via-royal-900/50 to-royal-900/20" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 md:px-10 md:pb-16">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-white/80">Yên Lạc Dragon City</p>
          <h1 className="font-heading text-3xl font-bold uppercase leading-tight tracking-wide text-white md:text-5xl">
            Tiến độ dự án
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 md:text-base">
            Hành trình khám phá Yên Lạc Dragon City qua video và hình ảnh phối cảnh: từ tổng thể, vị trí đến sản phẩm và tiện ích.
          </p>
          <a href="#video" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-royal-800 shadow-lg transition hover:bg-royal-50">
            <Play size={16} fill="currentColor" /> Xem video
          </a>
        </div>
      </section>

      {/* Video */}
      <section id="video" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12 md:px-10 md:py-16">
        <h2 className="mb-6 font-heading text-xl font-bold uppercase tracking-wider text-royal-800 md:text-3xl">Video dự án</h2>
        <div className="overflow-hidden rounded-2xl bg-black shadow-xl">
          <div className="relative aspect-video">
            {playing ? (
              <video key={video.id} src={videoUrl(video.src)} poster={video.poster} controls autoPlay playsInline preload="metadata" className="h-full w-full" />
            ) : (
              <button onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Phát ${video.label}`}>
                <img src={video.poster} alt={video.label} className="h-full w-full object-cover" />
                <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/10" />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-royal-700 shadow-2xl transition group-hover:scale-110 md:h-20 md:w-20">
                  <Play size={30} fill="currentColor" className="ml-1" />
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 md:gap-3">
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => { setVideoIdx(i); setPlaying(true); }}
              className={`overflow-hidden rounded-xl border-2 text-left transition ${i === videoIdx ? 'border-royal-600 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'}`}
            >
              <img src={v.poster} alt="" loading="lazy" className="aspect-video w-full object-cover" />
              <span className="block px-2 py-2 md:px-3">
                <span className="block text-[11px] font-semibold uppercase leading-tight tracking-wide text-royal-800 md:text-sm">{v.label}</span>
                <span className="text-[11px] text-gray-500 md:text-xs">{v.meta}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-royal-50/60 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <h2 className="mb-2 font-heading text-xl font-bold uppercase tracking-wider text-royal-800 md:text-3xl">Hành trình dự án</h2>
          <p className="mb-10 max-w-xl text-sm text-gray-600 md:mb-14 md:text-base">Sáu chặng giới thiệu toàn cảnh Yên Lạc Dragon City.</p>

          <ol className="relative">
            <span className="absolute bottom-0 left-[19px] top-0 w-px bg-royal-200 md:left-1/2" aria-hidden />
            {stages.map((s, i) => {
              const right = i % 2 === 1;
              return (
                <li key={s.key} className="relative mb-10 pl-14 last:mb-0 md:mb-16 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                  <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-royal-700 text-sm font-bold text-white shadow-lg ring-4 ring-royal-50 md:left-1/2 md:-translate-x-1/2">
                    {i + 1}
                  </span>
                  <div className={`md:pt-1 ${right ? 'md:order-2 md:text-left' : 'md:text-right'}`}>
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-royal-800 md:text-2xl">{s.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed text-gray-600 md:text-base ${right ? '' : 'md:ml-auto'} max-w-md`}>{s.desc}</p>
                  </div>
                  <div className={`mt-4 md:mt-0 ${right ? 'md:order-1' : ''}`}>
                    <div className={`grid gap-2 ${s.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {s.images.map((n, k) => (
                        <button
                          key={n}
                          onClick={() => openByImage(n)}
                          className={`group overflow-hidden rounded-xl shadow-md ${k === 0 && s.images.length % 2 === 1 ? 'col-span-2' : ''}`}
                          aria-label={`Xem ảnh ${s.title}`}
                        >
                          <img src={thumb(n)} alt={s.title} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" />
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
        <h2 className="mb-5 font-heading text-xl font-bold uppercase tracking-wider text-royal-800 md:text-3xl">Thư viện hình ảnh</h2>
        <div className="-mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0" role="tablist">
          {[{ key: 'all', short: 'Tất cả' }, ...stages].map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition ${filter === f.key ? 'bg-royal-700 text-white' : 'bg-royal-50 text-royal-800 hover:bg-royal-100'}`}
            >
              {f.short}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {list.map((g, i) => (
            <button key={g.n} onClick={() => setLightbox(i)} className="group overflow-hidden rounded-xl bg-royal-50 shadow">
              <img src={thumb(g.n)} alt={`Phối cảnh ${g.n}`} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-royal-800 px-5 py-12 text-center text-white md:py-16">
        <h2 className="font-heading text-xl font-bold uppercase tracking-wider md:text-3xl">Quan tâm Yên Lạc Dragon City?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/80">Liên hệ để nhận thông tin chi tiết và chính sách bán hàng mới nhất.</p>
        <div className="mx-auto mt-6 flex max-w-3xl flex-col items-stretch justify-center gap-3 sm:flex-row">
          {[
            { tel: '0986037396', num: '0986 037 396', label: 'Hotline' },
            { tel: '0868012336', num: '0868 012 336', label: 'Hotline KD (Nam)' },
            { tel: '0868826236', num: '0868 826 236', label: 'Hotline Thủ tục (Chị Gấm)' },
          ].map((h) => (
            <a key={h.tel} href={`tel:${h.tel}`} className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3 text-left text-royal-800 shadow-lg transition hover:bg-royal-50">
              <Phone size={20} className="shrink-0" />
              <span>
                <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">{h.label}</span>
                <span className="block text-base font-bold tracking-wide">{h.num}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && list[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm tabular-nums">{lightbox + 1} / {list.length}</span>
            <button onClick={() => setLightbox(null)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Đóng">
              <X size={22} />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-16" onClick={(e) => e.target === e.currentTarget && setLightbox(null)}>
            <button onClick={() => step(-1)} className="absolute left-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 md:flex" aria-label="Ảnh trước">
              <ChevronLeft size={26} />
            </button>
            <img src={full(list[lightbox].n)} alt="" className="max-h-full max-w-full select-none object-contain" draggable={false} />
            <button onClick={() => step(1)} className="absolute right-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 md:flex" aria-label="Ảnh sau">
              <ChevronRight size={26} />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            {list.map((g, i) => (
              <button key={g.n} onClick={() => setLightbox(i)} className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 md:h-16 md:w-24 ${i === lightbox ? 'border-white' : 'border-transparent opacity-60'}`}>
                <img src={thumb(g.n)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectProgressPage;
