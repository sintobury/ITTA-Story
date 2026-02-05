/**
 * [signup/page.tsx]
 * 회원가입 페이지입니다.
 * - 아이디 중복 확인, 비밀번호, 닉네임 입력을 받습니다.
 * - 가입 완료 시 로그인 페이지로 이동합니다.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function SignupPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [idMessage, setIdMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const { t } = useLanguage();
    const router = useRouter();

    const handleCheckDuplicate = () => {
        if (!id) return;

        // [클라 확인용] 중복 확인 목업 로직 (서버 연동 시 API 호출로 대체)
        if (id === "admin" || id === "user") {
            setIdMessage({ text: t.auth.idTaken, type: 'error' });
            setIsIdChecked(false);
        } else {
            setIdMessage({ text: t.auth.idAvailable, type: 'success' });
            setIsIdChecked(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isIdChecked) {
            alert(t.auth.checkIdFirst);
            return;
        }

        // [클라 확인용] 목업 회원가입 로직 (서버 연동 시 API 호출로 대체)
        alert(`Welcome, ${nickname}! Please login.`);
        router.push("/login");
    };

    return (
        <div className="flex justify-center pt-20 pb-8 min-h-[80vh]">
            <div className="bg-[var(--card-bg)] p-10 rounded-xl shadow-[var(--card-shadow)] w-full max-w-[400px]">
                <h1 className="text-center mb-8 text-[var(--primary)] text-3xl font-bold">{t.auth.signupTitle}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-[var(--foreground)]">{t.auth.id}</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => {
                                    setId(e.target.value);
                                    setIsIdChecked(false);
                                    setIdMessage(null);
                                }}
                                placeholder={t.auth.idPlaceholder}
                                className="w-full p-3 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-base focus:outline-none focus:border-[var(--primary)] transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={handleCheckDuplicate}
                                className="px-4 bg-[var(--secondary)] text-white border-none rounded-md cursor-pointer whitespace-nowrap text-sm hover:brightness-90 transition-all font-medium"
                            >
                                {t.auth.checkDuplicate}
                            </button>
                        </div>
                        {idMessage && (
                            <p className={`text-sm mt-1.5 ${idMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                {idMessage.text}
                            </p>
                        )}
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

                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-[var(--foreground)]">{t.auth.nickname}</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder={t.auth.nickPlaceholder}
                            className="w-full p-3 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-base focus:outline-none focus:border-[var(--primary)] transition-colors"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full p-3 bg-[var(--primary)] text-white border-none rounded-md text-base font-semibold cursor-pointer mt-4 hover:brightness-90 transition-all shadow-md hover:shadow-lg">
                        {t.auth.signupBtn}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--secondary)]">
                    {t.auth.hasAccount}
                    <Link href="/login" className="text-[var(--primary)] no-underline font-medium ml-2 hover:underline">
                        {t.auth.loginBtn}
                    </Link>
                </div>
            </div>
        </div>
    );
}
