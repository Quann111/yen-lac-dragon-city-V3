import { createClient } from 'npm:@supabase/supabase-js@2.112.3';
import { corsHeaders, json } from '../_shared/http.ts';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(request) });
  if (request.method !== 'POST') return json(request, { ok: false, message: 'Phương thức không được hỗ trợ.' }, 405);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const secretKey = Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const authorization = request.headers.get('authorization');
    const token = authorization?.replace(/^Bearer\s+/i, '');
    if (!supabaseUrl || !secretKey || !token) return json(request, { ok: false, message: 'Không có quyền truy cập.' }, 401);

    const admin = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) return json(request, { ok: false, message: 'Phiên đăng nhập không hợp lệ.' }, 401);
    const { data: membership } = await admin.from('recruitment_admins').select('user_id').eq('user_id', userData.user.id).maybeSingle();
    if (!membership) return json(request, { ok: false, message: 'Tài khoản không có quyền tuyển dụng.' }, 403);

    const body = await request.json();
    const applicationId = String(body?.application_id || '');
    if (!/^[0-9a-f-]{36}$/i.test(applicationId)) return json(request, { ok: false, message: 'Mã hồ sơ không hợp lệ.' }, 400);
    const { data: application } = await admin.from('applications').select('id,cv_path').eq('id', applicationId).maybeSingle();
    if (!application) return json(request, { ok: false, message: 'Không tìm thấy hồ sơ.' }, 404);

    const { error: storageError } = await admin.storage.from('recruitment-cvs').remove([application.cv_path]);
    if (storageError) throw storageError;
    const { error: deleteError } = await admin.from('applications').delete().eq('id', applicationId);
    if (deleteError) throw deleteError;
    return json(request, { ok: true });
  } catch (error) {
    console.error('delete-application failed', error);
    return json(request, { ok: false, message: 'Không thể xóa hồ sơ.' }, 500);
  }
});
