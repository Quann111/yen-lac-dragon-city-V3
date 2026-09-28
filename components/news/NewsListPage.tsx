import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Calendar, ChevronRight, Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, NewsPost } from '../../lib/news';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import SeoHead from '../shared/SeoHead';

const NewsListPage: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadPosts = async () => {
      if (!isSupabaseConfigured) {
        setError('Hệ thống tin tức đang được cấu hình. Vui lòng quay lại sau.');
        setLoading(false);
        return;
      }
      const { data, error: loadError } = await supabase
        .from('news_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (loadError) setError('Chưa thể tải tin tức. Vui lòng thử lại sau.');
      else setPosts((data || []) as NewsPost[]);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const categories = useMemo(() => ['Tất cả', ...new Set(posts.map((p) => p.category))], [posts]);

  const isFiltering = activeCategory !== 'Tất cả' || searchQuery.trim().length > 0;
  const featuredPost = !isFiltering ? posts[0] : undefined;
  const restPosts = featuredPost ? posts.slice(1) : posts;

  const filteredPosts = useMemo(() => restPosts.filter((post) => {
    const matchesCategory = activeCategory === 'Tất cả' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  }), [restPosts, activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 text-royal-900">
      <SeoHead
        title="Tin Tức & Sự Kiện | Yên Lạc Dragon City"
        description="Cập nhật những thông tin mới nhất về tiến độ dự án, sự kiện nổi bật và xu hướng thị trường bất động sản Yên Lạc Dragon City."
        path="/tin-tuc"
      />
      <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
            alt="Tin tức Yên Lạc Dragon City"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-royal-900/60"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <span className="inline-block py-1 px-3 rounded-full border border-white/30 text-white text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
            Tin Tức & Sự Kiện
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-plus font-semibold text-white mb-6 drop-shadow-2xl">
            Nhịp Sống <br className="hidden md:block" /> <span className="text-gold-400">Yên Lạc Dragon City</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-body font-normal">
            Cập nhật những thông tin mới nhất về tiến độ dự án, sự kiện nổi bật và xu hướng thị trường bất động sản.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {loading && <div className="py-20 text-center text-gray-500">Đang tải tin tức...</div>}
        {!loading && error && <div className="rounded-2xl bg-amber-50 border border-amber-200 p-8 text-center text-amber-800">{error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div className="rounded-3xl bg-white border border-dashed border-gray-300 py-16 text-center">
            <h3 className="text-xl font-bold text-royal-900">Chưa có bài viết nào</h3>
            <p className="mt-2 text-gray-500">Hãy quay lại trong thời gian tới.</p>
          </div>
        )}

        {!loading && !error && featuredPost && (
          <div className="mb-20">
            <h2 className="text-2xl font-plus font-semibold mb-8 flex items-center gap-3 text-royal-800">
              <span className="w-8 h-[2px] bg-current"></span>
              Tâm Điểm
            </h2>
            <Link
              to={`/tin-tuc/${featuredPost.slug}`}
              className="group relative grid md:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-glow-gold bg-white"
            >
              <div className="relative h-64 md:h-auto overflow-hidden">
                {featuredPost.cover_image_url && (
                  <img
                    src={featuredPost.cover_image_url}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute top-4 left-4 bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {featuredPost.category}
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-sm opacity-60 mb-4 font-mono">
                  <Calendar size={16} />
                  <span>{formatDate(featuredPost.published_at)}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-plus font-semibold mb-4 transition-colors duration-300 group-hover:text-gold-500 text-royal-900">
                  {featuredPost.title}
                </h3>
                <p className="mb-8 line-clamp-3 text-gray-600 font-body font-normal">
                  {featuredPost.excerpt}
                </p>
                <span className="flex items-center gap-2 font-bold uppercase text-sm tracking-wider transition-all duration-300 text-royal-600 group-hover:text-royal-800">
                  Đọc Thêm <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
              <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveCategory(item)}
                    className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300
                      ${item === activeCategory
                        ? 'bg-gold-500 text-navy-900 shadow-lg scale-105'
                        : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex items-center px-4 py-2 rounded-full w-full md:w-64 border transition-colors bg-white border-gray-200 focus-within:border-royal-500/50">
                <Search size={18} className="opacity-50 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm tin tức..."
                  className="bg-transparent border-none outline-none w-full text-sm placeholder-opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/tin-tuc/${post.slug}`}
                  className="group flex flex-col h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
                >
                  <div className="relative h-56 overflow-hidden">
                    {post.cover_image_url && (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs opacity-60 mb-3 font-mono">
                      <Clock size={14} />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <h3 className="text-xl font-plus font-semibold mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-gold-500 text-royal-900">
                      {post.title}
                    </h3>
                    <p className="text-sm mb-6 line-clamp-3 flex-grow text-gray-600 font-body font-normal">
                      {post.excerpt}
                    </p>
                    <div className="pt-4 border-t border-gray-100">
                      <span className="flex items-center justify-between w-full text-sm font-bold uppercase transition-colors text-gray-600 group-hover:text-royal-600">
                        Xem Chi Tiết
                        <span className="bg-current p-1 rounded-full text-navy-900 group-hover:rotate-45 transition-transform duration-300">
                          <ChevronRight size={14} className="text-white" />
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {filteredPosts.length === 0 && (
                <div className="col-span-full rounded-3xl bg-white border border-dashed border-gray-300 py-16 text-center">
                  <h3 className="text-xl font-bold text-royal-900">Không có bài viết phù hợp</h3>
                  <p className="mt-2 text-gray-500">Hãy điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                        ${page === currentPage
                          ? 'bg-gold-500 text-navy-900 shadow-lg'
                          : 'bg-white text-royal-900 hover:bg-gray-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsListPage;
