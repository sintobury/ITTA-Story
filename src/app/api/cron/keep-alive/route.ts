import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Vercel Cron 제약 우회 및 빠른 응답을 위해 Edge 런타임 사용 가능 (선택 사항)
// export const runtime = 'edge';

export async function GET(request: Request) {
    // 1. 보안 인가 체크 (Vercel Cron에서 호출될 때 CRON_SECRET 헤더 검증)
    // .env.local 및 Vercel 환경변수에 CRON_SECRET 값을 설정해야 안전합니다.
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // CRON_SECRET이 설정되어 있다면 올바른 헤더인지 검증
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. 관리자 권한 클라이언트 생성 (서비스 롤 키 사용)
        // 인증/인가 처리 없이 오직 DB 호출만을 목적으로 함
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

        // 3. 가장 가벼운 쿼리 실행
        // 가장 적은 부하를 주면서 활성 상태만 갱신하기 위해 id 컬럼 1개만 조회
        const { data, error } = await supabase
            .from('books')
            .select('id')
            .limit(1);

        if (error) {
            console.error('Keep-alive ping failed:', error.message);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Supabase keep-alive ping successful',
            results: data ? data.length : 0,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Keep-alive ping exception:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
