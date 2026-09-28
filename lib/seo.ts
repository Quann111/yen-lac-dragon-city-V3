import { NewsPost } from './news';
import { Job } from './recruitment';

export const SITE_URL = 'https://www.yenlac-dragoncity.com.vn';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/image/thumnaill.jpg`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  'toàn thời gian': 'FULL_TIME',
  'bán thời gian': 'PART_TIME',
  'thực tập': 'INTERN',
  'hợp đồng': 'CONTRACTOR',
};

export const mapEmploymentType = (value: string): string => EMPLOYMENT_TYPE_MAP[value.trim().toLowerCase()] || 'FULL_TIME';

export const buildNewsArticleJsonLd = (post: NewsPost) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  '@id': `${SITE_URL}/tin-tuc/${post.slug}#article`,
  headline: post.title,
  description: post.seo_description || post.excerpt,
  image: [post.cover_image_url || DEFAULT_OG_IMAGE],
  datePublished: post.published_at || post.created_at,
  dateModified: post.updated_at,
  author: { '@id': ORGANIZATION_ID },
  publisher: { '@id': ORGANIZATION_ID },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/tin-tuc/${post.slug}` },
  articleSection: post.category,
  inLanguage: 'vi-VN',
});

export const buildJobPostingJsonLd = (job: Job) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  '@id': `${SITE_URL}/tuyen-dung/${job.slug}#jobposting`,
  title: job.title,
  description: job.description,
  datePosted: job.published_at || job.created_at,
  validThrough: job.deadline ? new Date(job.deadline).toISOString() : undefined,
  employmentType: mapEmploymentType(job.employment_type),
  hiringOrganization: { '@id': ORGANIZATION_ID },
  jobLocation: {
    '@type': 'Place',
    address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'VN' },
  },
  baseSalary: job.salary_text
    ? { '@type': 'MonetaryAmount', currency: 'VND', value: { '@type': 'QuantitativeValue', value: job.salary_text } }
    : undefined,
  industry: 'Real Estate',
  totalJobOpenings: job.quantity,
  inLanguage: 'vi-VN',
});
