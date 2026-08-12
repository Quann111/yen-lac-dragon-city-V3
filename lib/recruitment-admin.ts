import { supabase } from './supabase';

export type RecruitmentAdminCheck =
  | { status: 'authorized' }
  | { status: 'forbidden' }
  | { status: 'error'; message: string };

export const checkRecruitmentAdmin = async (userId: string): Promise<RecruitmentAdminCheck> => {
  const { data, error } = await supabase
    .from('recruitment_admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Không thể kiểm tra quyền quản trị tuyển dụng:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return { status: 'error', message: error.message };
  }

  if (!data) {
    console.warn('Tài khoản đã đăng nhập nhưng chưa có quyền tuyển dụng:', { userId });
    return { status: 'forbidden' };
  }

  return { status: 'authorized' };
};
