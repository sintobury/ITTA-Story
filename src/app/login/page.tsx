/**
 * [login/page.tsx]
 * 사용자 로그인 페이지입니다.
 * - 아이디와 비밀번호를 입력받아 로그인을 처리합니다.
 * - 실제 인증 대신 Mock 데이터를 사용하여 로그인을 시뮬레이션합니다.
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
        // Supabase requires email, so we append a domain
        const email = `${id}@example.com`;

        try {
            // Login Logic Only
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            router.push("/");

        } catch (error: any) {
            triggerToast(error.message || "오류가 발생했습니다.");
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
                        {loading ? "Processing..." : t.auth.loginBtn}
                    </Button>
                </form>

                <Toast message={toastMessage} isExiting={isToastExiting} />
            </div>
        </div>
    );
}
