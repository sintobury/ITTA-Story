/**
 * [lib/supabase.ts]
 * 프로젝트 전역에서 사용되는 클라이언트 컴포넌트용 Supabase 인스턴스 단일 내보내기 파일입니다.
 * @supabase/ssr의 createBrowserClient를 사용하며, 보안 향상을 위해 로컬 스토리지가 아닌 
 * HttpOnly 쿠키 기반 인증을 사용하도록 설정되어 있습니다.
 */
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        cookieOptions: {
            maxAge: 12 * 60 * 60, // 12시간 (초 단위) - 이 설정을 통해 세션 유지 시간을 커스텀 제어합니다.
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        }
    }
);
