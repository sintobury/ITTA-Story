/**
 * [utils/supabase/middleware.ts]
 * Next.js proxy(미들웨어)에서 호출되어, HttpOnly 쿠키 기반 토큰의 유효성을 검증하고 갱신합니다.
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
            cookieOptions: {
                maxAge: 12 * 60 * 60, // 12시간 유지
            }
        }
    )

    // IMPORTANT: createServerClient와 supabase.auth.getUser() 호출 사이에 다른 로직을 작성하지 마세요.
    // 사이에 로직이 추가되면 크로스 브라우저 환경에서 쿠키 검증 관련 버그가 발생했을 때 디버깅이 매우 어려워질 수 있습니다.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return supabaseResponse
}
