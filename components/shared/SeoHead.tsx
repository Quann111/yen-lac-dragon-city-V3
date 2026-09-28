import { useEffect } from 'react';
import { DEFAULT_OG_IMAGE, SITE_URL } from '../../lib/seo';

// App là CSR thuần (không SSR), nên không cần react-helmet-async — thao tác thẳng document.head
// bằng useEffect vừa đủ, tránh phụ thuộc thư viện ngoài (đã thử react-helmet-async@3 nhưng
// không tương thích tốt với React 19: không dọn/replace tag đúng cách, gây trùng lặp).
// upsertMeta/upsertLink tìm đúng tag tĩnh có sẵn trong index.html (theo name/property/rel) và
// CẬP NHẬT nội dung tag đó thay vì tạo tag mới — nhờ vậy không bao giờ có 2 bản description/
// canonical/OG/Twitter song song, mỗi route ghi đè giá trị của route trước một cách an toàn.
const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const JSON_LD_ELEMENT_ID = 'seo-head-jsonld';
const upsertJsonLd = (data: object[] | null) => {
  const existing = document.getElementById(JSON_LD_ELEMENT_ID);
  if (!data) {
    existing?.remove();
    return;
  }
  let el = existing as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = JSON_LD_ELEMENT_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: object | object[];
}

const SeoHead: React.FC<SeoHeadProps> = ({ title, description, path, image, type = 'website', noindex = false, jsonLd }) => {
  useEffect(() => {
    // Canonical/og:url dùng path sạch (không "#") để khớp quy ước của index.html. URL thật trên
    // trình duyệt là SITE_URL + "/#" + path do app dùng HashRouter; crawler không chạy JS (preview
    // link Zalo/Facebook...) không thấy các tag này dù sao, nên path sạch có ý nghĩa hơn với
    // Google (có chạy JS) và các công cụ SEO.
    const canonical = `${SITE_URL}${path}`;
    const resolvedImage = image && !image.startsWith('http') ? `${SITE_URL}${image}` : image;
    const ogImage = resolvedImage || DEFAULT_OG_IMAGE;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertLink('canonical', canonical);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large');
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:site_name', 'Yên Lạc Dragon City');
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);
    upsertJsonLd(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : null);
  }, [title, description, path, image, type, noindex, jsonLd]);

  return null;
};

export default SeoHead;
