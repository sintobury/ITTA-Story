/**
 * [Navbar.tsx]
 * 사이트 상단의 네비게이션 바(헤더)를 담당하는 컴포넌트입니다.
 * - 로고 및 홈 이동 링크
 * - 테마 변경 (Theme Switcher)
 * - 언어 변경 (Language Switcher)
 * - 로그인/회원가입 또는 유저 환영 메시지 및 로그아웃 버튼
 */
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";

import { SITE_NAME } from "@/lib/constants";

export default function Navbar() {
    // 커스텀 훅을 사용하여 전역 상태(로그인, 언어, 테마)를 가져옴
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    return (
        <nav className="bg-[var(--card-bg)] shadow-sm sticky top-0 z-[100] w-full transition-all duration-300 border-b border-[var(--border)]">
            <div className="max-w-[1200px] mx-auto px-4 py-3 flex justify-between items-center w-full">
                {/* 로고: 클릭 시 메인 페이지로 이동 */}
                <Link href="/" className="text-2xl font-extrabold text-[var(--primary)] no-underline flex items-center gap-2">
                    📚 {SITE_NAME}
                </Link>

                <div className="flex items-center gap-4">

                    {/* 언어 선택 드롭다운 */}
                    <Select
                        value={language}
                        onChange={(val) => setLanguage(val as Language)}
                        options={[
                            { label: "한국어", value: "ko" },
                            { label: "English", value: "en" },
                        ]}
                        variant="default"
                        size="sm"
                        className="w-28 mr-4"
                    />

                    {/* 로그인 상태에 따른 UI 분기 처리 */}
                    {user ? (
                        <>
                            <Link href="/mypage" className="btn btn-secondary flex items-center gap-2">
                                <span>👤</span>
                                {t.nav.myPage}
                            </Link>
                            {/* 관리자(ADMIN)일 경우에만 관리자 페이지 링크 표시 */}
                            {user.role === "ADMIN" && (
                                <Link href="/admin" className="btn btn-secondary">
                                    {t.nav.admin}
                                </Link>
                            )}
                            <Button onClick={logout} variant="secondary">
                                {t.nav.logout}
                            </Button>
                        </>
                    ) : (
                        // 비로그인 상태일 때 로그인 버튼 표시
                        <div className="flex gap-2 items-center">
                            <Link href="/login" className="btn btn-primary no-underline">
                                {t.nav.login}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
