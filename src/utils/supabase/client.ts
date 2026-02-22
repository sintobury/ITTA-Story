/**
 * [utils/supabase/client.ts]
 * 클라이언트 컴포넌트 전용 Supabase 인스턴스를 생성하는 헬퍼 함수입니다.
 * 브라우저 환경에서 쿠키를 자동으로 읽고 쓸 수 있도록 도와줍니다.
 */
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
