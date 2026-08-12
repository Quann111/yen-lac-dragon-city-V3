import { createClient } from 'npm:@supabase/supabase-js@2.112.3';
import { corsHeaders, escapeHtml, json } from '../_shared/http.ts';

const allowedTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const allowedExtensions = new Set(['pdf', 'doc', 'docx']);
const maxFileSize = 5 * 1024 * 1024;

const requiredText = (form: FormData, name: string, maxLength: number) => {
  const value = String(form.get(name) || '').trim();
  if (!value || value.length > maxLength) throw new Error(`Trường ${name} không hợp lệ.`);
  return value;
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(request) });
  if (request.method !== 'POST') return json(request, { ok: false, message: 'Phương thức không được hỗ trợ.' }, 405);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const secretKey = Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !secretKey) return json(request, { ok: false, message: 'Máy chủ chưa được cấu hình.' }, 500);

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) return json(request, { ok: false, message: 'Dữ liệu gửi lên không hợp lệ.' }, 400);
    const form = await request.formData();
    if (String(form.get('company') || '').trim()) return json(request, { ok: true });

    const jobId = requiredText(form, 'job_id', 50);
    const fullName = requiredText(form, 'full_name', 120);
    const email = requiredText(form, 'email', 160).toLowerCase();
    const phone = requiredText(form, 'phone', 20);
    const currentLocation = requiredText(form, 'current_location', 180);
    const portfolioUrl = String(form.get('portfolio_url') || '').trim() || null;
    const coverLetter = String(form.get('cover_letter') || '').trim() || null;
    const consent = form.get('consent') === 'yes';
    const cv = form.get('cv');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(request, { ok: false, message: 'Email không hợp lệ.' }, 400);
    if (!/^[0-9+() .-]{8,20}$/.test(phone)) return json(request, { ok: false, message: 'Số điện thoại không hợp lệ.' }, 400);
    if (portfolioUrl && !/^https?:\/\//i.test(portfolioUrl)) return json(request, { ok: false, message: 'Liên kết portfolio không hợp lệ.' }, 400);
    if (coverLetter && coverLetter.length > 3000) return json(request, { ok: false, message: 'Thư giới thiệu quá dài.' }, 400);
    if (!consent) return json(request, { ok: false, message: 'Bạn cần đồng ý xử lý dữ liệu tuyển dụng.' }, 400);
    if (!(cv instanceof File)) return json(request, { ok: false, message: 'Vui lòng đính kèm CV.' }, 400);

    const extension = cv.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.has(extension) || (cv.type && !allowedTypes.has(cv.type)) || cv.size <= 0 || cv.size > maxFileSize) {
      return json(request, { ok: false, message: 'CV phải là PDF, DOC hoặc DOCX và không vượt quá 5 MB.' }, 400);
    }

    const admin = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: job, error: jobError } = await admin.from('jobs').select('id,title,slug,status,deadline').eq('id', jobId).maybeSingle();
    if (jobError || !job || job.status !== 'published' || (job.deadline && new Date(job.deadline) < new Date())) {
      return json(request, { ok: false, message: 'Vị trí không tồn tại hoặc đã ngừng nhận hồ sơ.' }, 400);
    }

    const path = `${jobId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await admin.storage.from('recruitment-cvs').upload(path, cv, { contentType: cv.type || undefined, upsert: false });
    if (uploadError) throw new Error(`Không thể lưu CV: ${uploadError.message}`);

    const { data: application, error: insertError } = await admin.from('applications').insert({
      job_id: jobId,
      full_name: fullName,
      email,
      phone,
      current_location: currentLocation,
      portfolio_url: portfolioUrl,
      cover_letter: coverLetter,
      cv_path: path,
      original_cv_name: cv.name.slice(0, 255),
      consent_at: new Date().toISOString(),
    }).select('id').single();

    if (insertError || !application) {
      await admin.storage.from('recruitment-cvs').remove([path]);
      throw new Error(`Không thể lưu hồ sơ: ${insertError?.message || 'unknown error'}`);
    }

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const toEmail = Deno.env.get('RECRUITMENT_TO_EMAIL') || 'tuyendung@d-park.com.vn';
    const fromEmail = Deno.env.get('RECRUITMENT_FROM_EMAIL');
    const siteUrl = (Deno.env.get('SITE_URL') || 'https://www.yenlac-dragoncity.com.vn').replace(/\/$/, '');
    let notificationStatus: 'sent' | 'failed' = 'failed';

    if (resendKey && fromEmail) {
      const applicant = escapeHtml(fullName);
      const jobTitle = escapeHtml(job.title);
      const adminUrl = `${siteUrl}/#/admin/ung-vien`;
      const sendEmail = (payload: Record<string, unknown>) => fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const [hrResult, applicantResult] = await Promise.allSettled([
        sendEmail({ from: fromEmail, to: [toEmail], subject: `[Ứng tuyển] ${job.title} - ${fullName}`, html: `<h2>Có hồ sơ ứng tuyển mới</h2><p><strong>Ứng viên:</strong> ${applicant}</p><p><strong>Vị trí:</strong> ${jobTitle}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Điện thoại:</strong> ${escapeHtml(phone)}</p><p><a href="${adminUrl}">Mở trang quản trị để xem và tải CV</a></p>` }),
        sendEmail({ from: fromEmail, to: [email], subject: `D-Park đã nhận hồ sơ ứng tuyển ${job.title}`, html: `<p>Chào ${applicant},</p><p>D-Park đã nhận hồ sơ ứng tuyển vị trí <strong>${jobTitle}</strong>. Bộ phận tuyển dụng sẽ liên hệ nếu hồ sơ phù hợp.</p><p>Trân trọng,<br/>D-Park Recruitment</p>` }),
      ]);
      notificationStatus = hrResult.status === 'fulfilled' && hrResult.value.ok && applicantResult.status === 'fulfilled' && applicantResult.value.ok ? 'sent' : 'failed';
    }

    await admin.from('applications').update({ notification_status: notificationStatus }).eq('id', application.id);
    return json(request, { ok: true, application_id: application.id });
  } catch (error) {
    console.error('submit-application failed', error);
    return json(request, { ok: false, message: 'Chưa thể tiếp nhận hồ sơ. Vui lòng thử lại sau.' }, 500);
  }
});

