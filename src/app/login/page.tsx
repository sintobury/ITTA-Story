/**
 * [login/page.tsx]
 * 사용자 로그인 페이지입니다.
 * - 아이디와 비밀번호를 입력받아 로그인을 처리합니다.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();
    const router = useRouter();
    const { toastMessage, isToastExiting, triggerToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Supabase는 이메일 형식이 필요하므로 도메인을 추가합니다.
        const email = `${id}@example.com`;

        try {
            // 1. 유저 존재 여부 확인 (상세 에러 처리)
            // Supabase에 'check_email_exists' RPC 함수가 필요합니다.
            const { data: userExists, error: rpcError } = await supabase.rpc('check_email_exists', {
                email_input: email
            });

            if (rpcError) {
                console.error("RPC Error:", rpcError);
                // RPC 실패 시 일반 로그인으로 진행 (예: 함수가 아직 생성되지 않음)
                // 또는 엄격도에 따라 에러를 발생시킬 수 있음.
                // 현재는 RPC가 없어도 유저를 차단하지 않도록 로그인 진행.
                // 단, 상세 에러는 확인할 수 없음.
            } else if (userExists === false) {
                // 유저가 존재하지 않음
                throw new Error(t.auth.userNotFound);
            }

            // 2. 로그인
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // 유저 존재 확인을 통과했다면 비밀번호 오류일 것임
                // (이메일 미인증 등 다른 오류일 수도 있지만 대개 비밀번호 오류)
                throw new Error(t.auth.wrongPassword);
            }

            router.push("/");

        } catch (error) {
            const err = error as Error;
            triggerToast(err.message || t.auth.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center pt-20 pb-8 min-h-[80vh]">
            <div className="bg-[var(--card-bg)] p-10 rounded-xl shadow-[var(--card-shadow)] w-full max-w-[400px]">
                <h1 className="text-center mb-8 text-[var(--primary)] text-3xl font-bold">{t.auth.loginTitle}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-[var(--foreground)]">{t.auth.id}</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder={t.auth.idPlaceholder}
                            className="w-full p-3 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-base focus:outline-none focus:border-[var(--primary)] transition-colors"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-[var(--foreground)]">{t.auth.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t.auth.pwPlaceholder}
                            className="w-full p-3 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-base focus:outline-none focus:border-[var(--primary)] transition-colors"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        className="mt-4 font-semibold shadow-md hover:shadow-lg"
                        disabled={loading}
                    >
                        {loading ? t.auth.processing : t.auth.loginBtn}
                    </Button>
                </form>

                <Toast message={toastMessage} isExiting={isToastExiting} />
            </div>
        </div>
    );
}
