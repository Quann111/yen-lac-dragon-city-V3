import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import brochure from '../image/optimized/brochure/brochure.webp';
import masterplan from '../image/optimized/brochure/masterplan.webp';
import panel1 from '../image/optimized/brochure/panel1.webp';
import panel2 from '../image/optimized/brochure/panel2.webp';
import panel3 from '../image/optimized/brochure/panel3.webp';
import panel4 from '../image/optimized/brochure/panel4.webp';
import panel5 from '../image/optimized/brochure/panel5.webp';
import panel6 from '../image/optimized/brochure/panel6.webp';

type Tab = 'brochure' | 'masterplan';

const tabs: { id: Tab; label: string }[] = [
  { id: 'brochure', label: 'Tờ gấp giới thiệu' },
  { id: 'masterplan', label: 'Tổng mặt bằng' },
];

const panels = [
  { src: panel1, title: 'Chạm kiệt tác – Mở lối tinh hoa' },
  { src: panel2, title: 'Vị trí trung tâm thủ phủ thương nghiệp miền Bắc' },
  { src: panel3, title: 'Đa tầng trải nghiệm – Vạn tầng hạnh phúc' },
  { src: panel4, title: 'Thông tin dự án Yên Lạc Dragon City' },
  { src: panel5, title: 'Bản đồ liên kết vùng' },
  { src: panel6, title: '6 lý do sở hữu Yên Lạc Dragon City' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const ProjectDocsModal: React.FC<Props> = ({ open, onClose }) => {
  const [tab, setTab] = useState<Tab>('brochure');
  const [zoomed, setZoomed] = useState(false);
  const [panelIndex, setPanelIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, y: 0, left: 0, top: 0, moved: false });
  const focus = useRef({ x: 0.5, y: 0.5 });

  // Centre the zoomed view on the point that was clicked
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!zoomed || !el) return;
    el.scrollLeft = focus.current.x * el.scrollWidth - el.clientWidth / 2;
    el.scrollTop = focus.current.y * el.scrollHeight - el.clientHeight / 2;
  }, [zoomed]);

  const onPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!zoomed || !el || e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop, moved: false };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const el = scrollRef.current;
      if (!el) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
      el.scrollLeft = drag.current.left - dx;
      el.scrollTop = drag.current.top - dy;
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  const onImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    focus.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    setZoomed((z) => !z);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    setZoomed(false);
  }, [tab, open]);

  if (!open) return null;

  const desktopSrc = tab === 'brochure' ? brochure : masterplan;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Tư liệu dự án"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 shadow-md md:px-8">
        <div className="min-w-0">
          <h2 className="truncate font-heading text-base font-bold uppercase tracking-wider text-royal-800 md:text-lg">
            Tư liệu dự án
          </h2>
          <p className="hidden text-xs text-gray-500 md:block">Yên Lạc Dragon City</p>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-royal-700 text-white' : 'bg-royal-50 text-royal-800 hover:bg-royal-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { focus.current = { x: 0.5, y: 0.5 }; setZoomed((z) => !z); }}
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-royal-50 text-royal-800 transition-colors hover:bg-royal-100 md:flex"
            aria-label={zoomed ? 'Thu nhỏ' : 'Phóng to'}
          >
            {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-royal-50 text-royal-800 transition-colors hover:bg-royal-100"
            aria-label="Đóng"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="grid grid-cols-2 gap-1 bg-white px-3 pb-3 md:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-royal-700 text-white' : 'bg-royal-50 text-royal-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Desktop viewer: identical to the original print layout */}
      <div
        className="hidden min-h-0 flex-1 md:flex md:items-center md:justify-center md:p-6"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          ref={scrollRef}
          onMouseDown={onPointerDown}
          className={`h-full w-full ${zoomed ? `overflow-auto select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}` : 'flex items-center justify-center overflow-hidden'}`}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <img
            src={desktopSrc}
            alt={tab === 'brochure' ? 'Tờ gấp Yên Lạc Dragon City' : 'Tổng mặt bằng Yên Lạc Dragon City'}
            onClick={onImageClick}
            className={`rounded-lg shadow-2xl ${
              zoomed
                ? 'max-w-none'
                : 'max-h-full max-w-full cursor-zoom-in object-contain'
            }`}
            style={zoomed ? { width: '200%' } : undefined}
            draggable={false}
          />
        </div>
      </div>

      {/* Mobile viewer */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-royal-50 md:hidden">
        {tab === 'brochure' ? (
          <div className="flex flex-col gap-4 p-3 pb-8">
            <div className="sticky top-0 z-10 -mx-3 -mt-3 flex items-center justify-between bg-royal-50/95 px-3 py-2 backdrop-blur">
              <button
                onClick={() => {
                  const next = Math.max(0, panelIndex - 1);
                  setPanelIndex(next);
                  document.getElementById(`brochure-panel-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                disabled={panelIndex === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-royal-800 shadow disabled:opacity-40"
                aria-label="Trang trước"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-medium uppercase tracking-wider text-royal-800">
                {panelIndex + 1} / {panels.length}
              </span>
              <button
                onClick={() => {
                  const next = Math.min(panels.length - 1, panelIndex + 1);
                  setPanelIndex(next);
                  document.getElementById(`brochure-panel-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                disabled={panelIndex === panels.length - 1}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-royal-800 shadow disabled:opacity-40"
                aria-label="Trang sau"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            {panels.map((p, i) => (
              <figure
                key={p.src}
                id={`brochure-panel-${i}`}
                className="scroll-mt-14 overflow-hidden rounded-xl bg-white shadow-md"
              >
                <img
                  src={p.src}
                  alt={p.title}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="block h-auto w-full"
                />
                <figcaption className="px-3 py-2 text-xs font-medium text-royal-800">
                  {i + 1}. {p.title}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <p className="bg-white px-4 py-2 text-center text-xs text-gray-500">
              Vuốt ngang / dọc để xem chi tiết mặt bằng
            </p>
            <div className="min-h-0 flex-1 overflow-auto">
              <img
                src={masterplan}
                alt="Tổng mặt bằng Yên Lạc Dragon City"
                className="block h-auto max-w-none"
                style={{ width: '230vw' }}
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDocsModal;
