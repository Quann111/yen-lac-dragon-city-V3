import React, { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bold, Eye, Heading2, Heading3, ImagePlus, Italic, Link as LinkIcon, List, ListOrdered,
  Pencil, Plus, Quote, Save, Search, Trash2, Underline as UnderlineIcon, X,
} from 'lucide-react';
import { generateSlug, NewsPost, newsStatusLabels, NewsStatus } from '../../lib/news';
import { supabase } from '../../lib/supabase';
import MarkdownContent from '../recruitment/MarkdownContent';

type NewsForm = Omit<NewsPost, 'id' | 'created_at' | 'updated_at' | 'published_at'>;

const CATEGORIES = ['Kiến trúc', 'Tiện ích', 'Thị trường', 'Sự kiện', 'Danh mục hồ sơ pháp lý'];

const emptyForm: NewsForm = {
  title: '', slug: '', category: CATEGORIES[0], excerpt: '', cover_image_url: '', content: '',
  status: 'draft', seo_title: '', seo_description: '',
};

const AdminNewsPage: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [preview, setPreview] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [insertingImage, setInsertingImage] = useState(false);
  const [message, setMessage] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('news_posts').select('*').order('created_at', { ascending: false });
    if (error) setMessage(`Không thể tải dữ liệu: ${error.message}`);
    else setPosts((data || []) as NewsPost[]);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const filtered = useMemo(() => posts.filter((post) => {
    const text = `${post.title} ${post.category}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!statusFilter || post.status === statusFilter);
  }), [posts, query, statusFilter]);

  const updateField = <K extends keyof NewsForm>(field: K, value: NewsForm[K]) => setForm((current) => ({ ...current, [field]: value }));
  const updateTitle = (title: string) => setForm((current) => ({ ...current, title, slug: editingId && current.slug ? current.slug : generateSlug(title), seo_title: current.seo_title || title, seo_description: current.seo_description || current.excerpt }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreview(false);
    setMessage('');
    setFormOpen(true);
  };

  const openEdit = (post: NewsPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title, slug: post.slug, category: post.category, excerpt: post.excerpt,
      cover_image_url: post.cover_image_url || '', content: post.content, status: post.status,
      seo_title: post.seo_title || '', seo_description: post.seo_description || '',
    });
    setPreview(false);
    setMessage('');
    setFormOpen(true);
  };

  const uploadFileToStorage = async (file: File) => {
    const path = `${Date.now()}-${generateSlug(file.name.replace(/\.[^.]+$/, ''))}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('news-images').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('news-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const uploadCoverImage = async (file: File) => {
    setUploading(true);
    setMessage('');
    try {
      const url = await uploadFileToStorage(file);
      updateField('cover_image_url', url);
    } catch (err) {
      setMessage(`Tải ảnh thất bại: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
    }
    setUploading(false);
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = contentRef.current;
    if (!textarea) {
      updateField('content', form.content + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = form.content;
    const newValue = `${value.slice(0, start)}${text}${value.slice(end)}`;
    updateField('content', newValue);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const wrapSelection = (before: string, after: string, placeholder: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.slice(start, end) || placeholder;
    insertTextAtCursor(`${before}${selected}${after}`);
  };

  const prefixCurrentLine = (prefix: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const value = form.content;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newValue = `${value.slice(0, lineStart)}${prefix}${value.slice(lineStart)}`;
    updateField('content', newValue);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + prefix.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const applyFormat = (type: 'bold' | 'italic' | 'underline' | 'h2' | 'h3' | 'quote' | 'ul' | 'ol' | 'link') => {
    switch (type) {
      case 'bold': return wrapSelection('**', '**', 'in đậm');
      case 'italic': return wrapSelection('*', '*', 'in nghiêng');
      case 'underline': return wrapSelection('[u]', '[/u]', 'gạch chân');
      case 'h2': return prefixCurrentLine('## ');
      case 'h3': return prefixCurrentLine('### ');
      case 'quote': return prefixCurrentLine('> ');
      case 'ul': return prefixCurrentLine('- ');
      case 'ol': return prefixCurrentLine('1. ');
      case 'link': {
        const url = window.prompt('Nhập URL liên kết:');
        if (!url) return;
        return wrapSelection('[', `](${url})`, 'văn bản liên kết');
      }
      default: return undefined;
    }
  };

  const handleContentKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (event.key === 'b') { event.preventDefault(); applyFormat('bold'); }
    else if (event.key === 'i') { event.preventDefault(); applyFormat('italic'); }
    else if (event.key === 'u') { event.preventDefault(); applyFormat('underline'); }
  };

  const insertImagesIntoContent = async (files: FileList | File[], withPrompt: boolean) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    setInsertingImage(true);
    setMessage('');
    for (const file of imageFiles) {
      try {
        const url = await uploadFileToStorage(file);
        const defaultAlt = file.name.replace(/\.[^.]+$/, '');
        const alt = withPrompt ? (window.prompt('Alt text cho ảnh (mô tả ngắn):', defaultAlt) ?? defaultAlt) : defaultAlt;
        const caption = withPrompt ? (window.prompt('Chú thích ảnh (bỏ trống nếu không cần):', '') ?? '') : '';
        insertTextAtCursor(`\n\n![${alt}](${url}${caption ? ` "${caption}"` : ''})\n\n`);
      } catch (err) {
        setMessage(`Chèn ảnh thất bại: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
      }
    }
    setInsertingImage(false);
  };

  const handleContentPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.clipboardData.files);
    if (files.length === 0) return;
    event.preventDefault();
    insertImagesIntoContent(files, false);
  };

  const handleContentDrop = (event: React.DragEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;
    event.preventDefault();
    insertImagesIntoContent(files, false);
  };

  const savePost = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const payload = {
      ...form,
      slug: generateSlug(form.slug),
      cover_image_url: form.cover_image_url || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    };
    const result = editingId
      ? await supabase.from('news_posts').update(payload).eq('id', editingId)
      : await supabase.from('news_posts').insert(payload);
    if (result.error) setMessage(result.error.code === '23505' ? 'Slug đã tồn tại. Vui lòng chọn slug khác.' : result.error.message);
    else {
      setFormOpen(false);
      await loadPosts();
    }
    setSaving(false);
  };

  const deletePost = async (post: NewsPost) => {
    if (!window.confirm(`Xóa bài viết “${post.title}”?`)) return;
    await supabase.from('news_posts').delete().eq('id', post.id);
    await loadPosts();
  };

  const fieldClass = 'mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none focus:border-royal-500';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-royal-900">Bài viết tin tức</h2><p className="text-sm text-gray-500">Tạo, xuất bản và quản lý các bài viết tin tức.</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-royal-600 px-5 py-3 font-bold text-white hover:bg-royal-700"><Plus size={18} /> Thêm bài viết</button>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px]">
        <label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tiêu đề hoặc chuyên mục..." className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 outline-none focus:border-royal-500" /></label>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 bg-white"><option value="">Tất cả trạng thái</option><option value="draft">Bản nháp</option><option value="published">Đã đăng</option></select>
      </div>
      {message && !formOpen && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-amber-800">{message}</p>}
      <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-royal-50 text-royal-900"><tr><th className="p-4">Bài viết</th><th className="p-4">Chuyên mục</th><th className="p-4">Trạng thái</th><th className="p-4 text-right">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={4} className="p-8 text-center text-gray-500">Đang tải...</td></tr>}
            {!loading && filtered.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50">
                <td className="p-4"><p className="font-bold text-gray-900">{post.title}</p><p className="text-xs text-gray-400">/{post.slug}</p></td>
                <td className="p-4">{post.category}</td>
                <td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{newsStatusLabels[post.status]}</span></td>
                <td className="p-4"><div className="flex justify-end gap-2">
                  {post.status === 'published' && <button title="Xem công khai" onClick={() => window.open(`#/tin-tuc/${post.slug}`, '_blank', 'noopener,noreferrer')} className="rounded-lg p-2 text-gray-500 hover:bg-royal-50 hover:text-royal-600"><Eye size={17} /></button>}
                  <button title="Sửa" onClick={() => openEdit(post)} className="rounded-lg p-2 text-gray-500 hover:bg-royal-50 hover:text-royal-600"><Pencil size={17} /></button>
                  <button title="Xóa" onClick={() => deletePost(post)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button>
                </div></td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">Không có bài viết phù hợp.</td></tr>}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="mx-auto my-5 max-w-5xl rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b bg-white px-6 py-4"><div><h3 className="text-xl font-bold text-royal-900">{editingId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h3></div><button onClick={() => setFormOpen(false)} className="rounded-full p-2 hover:bg-gray-100"><X /></button></div>
            <div className="border-b px-6 py-3 flex gap-2"><button onClick={() => setPreview(false)} className={`rounded-lg px-4 py-2 text-sm font-bold ${!preview ? 'bg-royal-600 text-white' : 'bg-gray-100'}`}>Viết</button><button onClick={() => setPreview(true)} className={`rounded-lg px-4 py-2 text-sm font-bold ${preview ? 'bg-royal-600 text-white' : 'bg-gray-100'}`}>Xem trước</button></div>
            {preview ? (
              <div className="p-8 space-y-6">
                {form.cover_image_url && <img src={form.cover_image_url} alt={form.title} className="w-full h-64 object-cover rounded-2xl" />}
                <span className="inline-block rounded-full bg-royal-50 px-3 py-1 text-xs font-bold uppercase text-royal-700">{form.category}</span>
                <h1 className="text-4xl font-bold text-royal-900">{form.title || 'Tiêu đề bài viết'}</h1>
                <p className="text-lg text-gray-600">{form.excerpt}</p>
                <MarkdownContent content={form.content || 'Chưa có nội dung'} />
              </div>
            ) : (
              <form onSubmit={savePost} className="p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-semibold">Tiêu đề *<input required value={form.title} onChange={(e) => updateTitle(e.target.value)} className={fieldClass} /></label>
                  <label className="text-sm font-semibold">Slug *<input required value={form.slug} onChange={(e) => updateField('slug', e.target.value)} className={fieldClass} /></label>
                  <label className="text-sm font-semibold">Chuyên mục *<select required value={form.category} onChange={(e) => updateField('category', e.target.value)} className={fieldClass}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
                  <label className="text-sm font-semibold">Trạng thái<select value={form.status} onChange={(e) => updateField('status', e.target.value as NewsStatus)} className={fieldClass}><option value="draft">Bản nháp</option><option value="published">Đã đăng</option></select></label>
                </div>
                <label className="block text-sm font-semibold">Ảnh bìa
                  <div className="mt-1.5 flex items-center gap-3">
                    {form.cover_image_url && <img src={form.cover_image_url} alt="" className="h-16 w-24 rounded-lg object-cover" />}
                    <span className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-royal-200 bg-royal-50/40 px-4 py-3 text-sm text-royal-700 hover:border-royal-500">
                      <ImagePlus size={18} />{uploading ? 'Đang tải...' : 'Tải ảnh lên'}
                      <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(e) => e.target.files?.[0] && uploadCoverImage(e.target.files[0])} />
                    </span>
                    <input value={form.cover_image_url || ''} onChange={(e) => updateField('cover_image_url', e.target.value)} placeholder="hoặc dán URL ảnh" className={`${fieldClass} mt-0 flex-1`} />
                  </div>
                </label>
                <label className="block text-sm font-semibold">Mô tả ngắn *<textarea required maxLength={500} rows={3} value={form.excerpt} onChange={(e) => updateField('excerpt', e.target.value)} className={fieldClass} /></label>
                <label className="block text-sm font-semibold">
                  Nội dung *
                  <div className="mt-1.5 flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-gray-200 bg-gray-50 p-2">
                    <button type="button" title="In đậm (Ctrl+B)" onClick={() => applyFormat('bold')} className="rounded-lg p-2 text-gray-600 hover:bg-white"><Bold size={16} /></button>
                    <button type="button" title="In nghiêng (Ctrl+I)" onClick={() => applyFormat('italic')} className="rounded-lg p-2 text-gray-600 hover:bg-white"><Italic size={16} /></button>
                    <button type="button" title="Gạch chân (Ctrl+U)" onClick={() => applyFormat('underline')} className="rounded-lg p-2 text-gray-600 hover:bg-white"><UnderlineIcon size={16} /></button>
                    <span className="mx-1 h-5 w-px bg-gray-300" />
                    <button type="button" title="Tiêu đề H2" onClick={() => applyFormat('h2')} className="rounded-lg p-2 text-gray-600 hover:bg-white"><Heading2 size={16} /></button>
                    <button type="button" title="Tiêu đề H3" onClick={() => applyFormat('h3')} className="rounded-lg p-2 text-gray-600 hover:bg-white"><Heading3 size={16} /></button>
                    <button type="button" title="Trích dẫn" onClick={() => applyFormat('quote')} className="rounded-lg p-2 text-gray-600 hover:bg-white"><Quote size={16} /></button>
                    <span className="mx-1 h-5 w-px bg-gray-300" />
                    <button type="button" title="Danh sách" onClick={() => applyFormat('ul')} className="rounded-lg p-2 text-gray-600 hover:bg-white"><List size={16} /></button>
                    <button type="button" title="Danh sách có số" onClick={() => applyFormat('ol')} className="rounded-lg p-2 text-gray-600 hover:bg-white"><ListOrdered size={16} /></button>
                    <button type="button" title="Liên kết" onClick={() => applyFormat('link')} className="rounded-lg p-2 text-gray-600 hover:bg-white"><LinkIcon size={16} /></button>
                    <span className="mx-1 h-5 w-px bg-gray-300" />
                    <label title="Chèn ảnh (có thể chọn nhiều ảnh)" className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-normal text-gray-600 hover:bg-white">
                      <ImagePlus size={16} />{insertingImage ? 'Đang chèn...' : 'Chèn ảnh'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        disabled={insertingImage}
                        onChange={(e) => { if (e.target.files?.length) insertImagesIntoContent(e.target.files, true); e.target.value = ''; }}
                      />
                    </label>
                  </div>
                  <textarea
                    ref={contentRef}
                    required
                    rows={12}
                    value={form.content}
                    onChange={(e) => updateField('content', e.target.value)}
                    onKeyDown={handleContentKeyDown}
                    onPaste={handleContentPaste}
                    onDrop={handleContentDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={`${fieldClass} mt-0 rounded-t-none font-mono text-sm`}
                    placeholder={'Hỗ trợ **in đậm**, *in nghiêng*, [u]gạch chân[/u], ## Tiêu đề, > trích dẫn, - danh sách, 1. danh sách số, [liên kết](url). Có thể kéo-thả hoặc dán (Ctrl+V) ảnh trực tiếp vào đây.'}
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-semibold">SEO title <span className="font-normal text-gray-400">({(form.seo_title || '').length}/60)</span><input maxLength={70} value={form.seo_title || ''} onChange={(e) => updateField('seo_title', e.target.value)} className={fieldClass} /></label>
                  <label className="text-sm font-semibold">SEO description <span className="font-normal text-gray-400">({(form.seo_description || '').length}/160)</span><input maxLength={180} value={form.seo_description || ''} onChange={(e) => updateField('seo_description', e.target.value)} className={fieldClass} /></label>
                </div>
                {message && <p className="rounded-xl bg-red-50 p-3 text-red-700">{message}</p>}
                <div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border px-5 py-3 font-bold">Hủy</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-royal-600 px-5 py-3 font-bold text-white disabled:opacity-60"><Save size={18} />{saving ? 'Đang lưu...' : 'Lưu bài viết'}</button></div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsPage;
