import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDate, NewsPost } from '../../lib/news';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import MarkdownContent from '../recruitment/MarkdownContent';

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadPost = async () => {
      if (!isSupabaseConfigured) {
        setError('Hệ thống tin tức đang được cấu hình.');
        setLoading(false);
        return;
      }
      const { data, error: loadError } = await supabase
        .from('news_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (loadError || !data) setError('Bài viết này không tồn tại hoặc đã bị gỡ.');
      else {
        const loadedPost = data as NewsPost;
        setPost(loadedPost);
        document.title = `${loadedPost.seo_title || loadedPost.title} | Yên Lạc Dragon City`;
      }
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-gray-500">Đang tải bài viết...</div>;

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 px-6 text-center">
        <Newspaper size={56} className="mx-auto text-gray-300" />
        <h1 className="mt-5 text-3xl font-bold text-royal-900">Không thể mở bài viết</h1>
        <p className="mt-3 text-gray-600">{error}</p>
        <Link to="/tin-tuc" className="mt-7 inline-flex items-center gap-2 rounded-full bg-royal-600 px-6 py-3 text-white"><ArrowLeft size={18} /> Danh sách tin tức</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-body">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/tin-tuc" className="inline-flex items-center gap-2 text-sm font-semibold text-royal-600 hover:text-gold-600"><ArrowLeft size={17} /> Quay lại tin tức</Link>

        <div className="mt-6">
          <span className="inline-block px-3 py-1 rounded-full bg-gold-500 text-navy-900 text-xs font-bold uppercase mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-plus font-semibold text-royal-900 leading-tight">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center gap-2 text-sm text-gray-500 font-mono">
            <Calendar size={16} />
            <span>{formatDate(post.published_at)}</span>
          </div>
        </div>

        {post.cover_image_url && (
          <div className="mt-8 rounded-3xl overflow-hidden shadow-xl">
            <img src={post.cover_image_url} alt={post.title} className="w-full max-h-[480px] object-cover" />
          </div>
        )}

        <article className="mt-10 rounded-3xl bg-white p-7 md:p-10 shadow-sm border border-gray-100">
          <p className="text-lg text-gray-700 font-semibold leading-relaxed mb-8">{post.excerpt}</p>
          <MarkdownContent content={post.content} />
        </article>
      </div>
    </div>
  );
};

export default NewsDetailPage;
