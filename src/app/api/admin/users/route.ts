import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, nickname } = body;

        if (!email || !password || !nickname) {
            return NextResponse.json(
                { error: 'Email, password, and nickname are required.' },
                { status: 400 }
            );
        }

        // Admin Client 생성 (Service Role Key 필요)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // 유저 생성
        const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            user_metadata: { displayName: nickname },
            email_confirm: true // 이메일 확인 자동 완료
        });

        if (error) {
            console.error('Error creating user:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ user }, { status: 201 });

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
