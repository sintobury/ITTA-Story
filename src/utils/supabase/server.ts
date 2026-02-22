/**
 * [utils/supabase/server.ts]
 * 서버 컴포넌트 전용 Supabase 인스턴스를 생성하는 헬퍼 함수입니다.
 * next/headers의 cookies()를 사용하여 비동기적으로 서버 측 쿠키에 접근합니다.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // `setAll` 메서드는 서버 컴포넌트에서 호출되었습니다.
                        // 서버 컴포넌트에서는 쿠키를 직접 설정할 수 없어 에러가 발생하지만,
                        // proxy(미들웨어)에서 세션을 갱신하므로 이 에러는 무시해도 안전합니다.
                    }
                },
            },
        }
    )
}
