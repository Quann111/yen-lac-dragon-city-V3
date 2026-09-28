// Sinh public/sitemap.xml từ dữ liệu Supabase (news_posts + jobs đã published).
// Lưu ý: vì app dùng HashRouter và deploy tĩnh (GitHub Pages, không SSR/prerender),
// các URL dưới đây trỏ path "sạch" (không có "#") để khớp quy ước canonical hiện có
// trong index.html và SeoHead — crawler chạy JS (Googlebot) vẫn đọc được nội dung
// thật ở URL có "#", nhưng truy cập trực tiếp URL sạch qua GitHub Pages sẽ 404 do
// không có rewrite server-side. Đây là giới hạn đã biết, không xử lý trong script này.
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const loadEnvLocal = () => {
  try {
    const content = readFileSync(path.join(rootDir, '.env.local'), 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
    }
  } catch {
    // .env.local không tồn tại (vd trong CI) — bỏ qua, dùng process.env sẵn có
  }
};

loadEnvLocal();

const SITE_URL = 'https://www.yenlac-dragoncity.com.vn';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const STATIC_PAGES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/tin-tuc', changefreq: 'daily', priority: '0.8' },
  { loc: '/tuyen-dung', changefreq: 'weekly', priority: '0.8' },
];

const escapeXml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const buildUrlEntry = ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${loc}`)}</loc>${lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const main = async () => {
  const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[generate-sitemap] Thiếu VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY — giữ nguyên sitemap.xml hiện có.');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const entries = [...STATIC_PAGES];

  try {
    const { data: posts, error: postsError } = await supabase
      .from('news_posts')
      .select('slug, published_at, updated_at')
      .eq('status', 'published');
    if (postsError) throw postsError;

    for (const post of posts || []) {
      entries.push({
        loc: `/tin-tuc/${post.slug}`,
        lastmod: post.updated_at || post.published_at,
        changefreq: 'monthly',
        priority: '0.6',
      });
    }

    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('slug, published_at, updated_at, deadline')
      .eq('status', 'published');
    if (jobsError) throw jobsError;

    const now = new Date();
    for (const job of jobs || []) {
      if (job.deadline && new Date(job.deadline) < now) continue;
      entries.push({
        loc: `/tuyen-dung/${job.slug}`,
        lastmod: job.updated_at || job.published_at,
        changefreq: 'weekly',
        priority: '0.6',
      });
    }
  } catch (error) {
    console.warn('[generate-sitemap] Không thể tải dữ liệu từ Supabase, giữ nguyên sitemap.xml hiện có:', error.message);
    return;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(buildUrlEntry).join('\n')}
</urlset>
`;

  writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`[generate-sitemap] Đã ghi ${entries.length} URL vào public/sitemap.xml`);
};

main();
