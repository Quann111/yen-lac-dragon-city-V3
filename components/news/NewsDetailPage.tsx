import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, Newspaper } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDate, NewsPost } from '../../lib/news';
import { buildNewsArticleJsonLd } from '../../lib/seo';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import MarkdownContent from '../recruitment/MarkdownContent';
import SeoHead from '../shared/SeoHead';

type RelatedPost = Pick<NewsPost, 'id' | 'title' | 'slug' | 'category' | 'excerpt' | 'cover_image_url' | 'published_at'>;

const RELATED_LIMIT = 3;

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 'instant': html có scroll-behavior: smooth, nếu animate thì bị ngắt khi trang co lại lúc loading
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLoading(true);
    setError('');
    setRelated([]);
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
      else setPost(data as NewsPost);
      setLoading(false);

      if (loadError || !data) return;
      const { data: others } = await supabase
        .from('news_posts')
        .select('id, title, slug, category, excerpt, cover_image_url, published_at')
        .eq('status', 'published')
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(12);
      const sameCategoryFirst = [...((others || []) as RelatedPost[])]
        .sort((a, b) => Number(b.category === data.category) - Number(a.category === data.category));
      setRelated(sameCategoryFirst.slice(0, RELATED_LIMIT));
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
      <SeoHead
        title={`${post.seo_title || post.title} | Yên Lạc Dragon City`}
        description={post.seo_description || post.excerpt}
        path={`/tin-tuc/${post.slug}`}
        image={post.cover_image_url}
        type="article"
        jsonLd={buildNewsArticleJsonLd(post)}
      />
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

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-news-heading">
            <h2 id="related-news-heading" className="text-2xl font-plus font-semibold text-royal-800 flex items-center gap-3 mb-8">
              <span className="w-8 h-[2px] bg-current"></span>
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/tin-tuc/${item.slug}`}
                  className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    {item.cover_image_url && (
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-mono">
                      <Clock size={13} />
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                    <h3 className="text-base font-plus font-semibold line-clamp-3 text-royal-900 transition-colors duration-300 group-hover:text-gold-500">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 flex justify-center">
          <Link
            to="/tin-tuc"
            className="inline-flex items-center gap-2 rounded-full bg-royal-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-colors duration-300 hover:bg-royal-800"
          >
            Xem tất cả tin tức <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
