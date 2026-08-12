export type JobStatus = 'draft' | 'published' | 'closed';
export type ApplicationStatus = 'new' | 'reviewing' | 'interview' | 'hired' | 'rejected';

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  quantity: number;
  salary_text: string | null;
  summary: string;
  description: string;
  requirements: string;
  benefits: string;
  deadline: string | null;
  status: JobStatus;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  current_location: string;
  portfolio_url: string | null;
  cover_letter: string | null;
  cv_path: string;
  original_cv_name: string;
  consent_at: string;
  status: ApplicationStatus;
  internal_notes: string | null;
  notification_status: 'pending' | 'sent' | 'failed';
  created_at: string;
  updated_at: string;
  jobs?: Pick<Job, 'id' | 'title' | 'slug'> | null;
}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  new: 'Mới',
  reviewing: 'Đang xem',
  interview: 'Phỏng vấn',
  hired: 'Đạt',
  rejected: 'Loại',
};

export const jobStatusLabels: Record<JobStatus, string> = {
  draft: 'Bản nháp',
  published: 'Đang tuyển',
  closed: 'Đã đóng',
};

export const generateSlug = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

export const formatDate = (value: string | null | undefined) => {
  if (!value) return 'Không giới hạn';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};

