/**
 * [proxy.ts]
 * Next.js 앱 라우터의 전역 미들웨어(proxy)입니다.
 * 매 요청마다 utils/supabase/middleware 로직을 실행해 쿠키 세션을 리프레시합니다.
 */
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * 다음 경로로 시작하는 요청을 제외한 모든 요청 경로에 대해 미들웨어 로직이 실행됩니다:
         * - _next/static (정적 스크립트 파일 등)
         * - _next/image (이미지 최적화 기능 서버)
         * - favicon.ico (파비콘)
         * - 기타 정적 이미지 리소스 (svg, png, jpg 등)
         * 추가적으로 제외할 경로가 있다면 정규식을 수정할 수 있습니다.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
