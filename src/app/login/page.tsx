/**
 * [login/page.tsx]
 * 사용자 로그인 페이지입니다.
 * - 아이디와 비밀번호를 입력받아 로그인을 처리합니다.
 * - 실제 인증 대신 Mock 데이터를 사용하여 로그인을 시뮬레이션합니다.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const { loginAsUser, loginAsAdmin } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // [클라 확인용] 목업 로그인 로직 (서버 연동 시 API 호출로 대체)
        if (id === "admin" && password === "admin") {
            loginAsAdmin();
        } else {
            // 그 외의 입력은 일반 유저로 처리
            loginAsUser();
        }
        router.push("/");
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
                    >
                        {t.auth.loginBtn}
                    </Button>
                </form>

            </div>
        </div>
    );
}
