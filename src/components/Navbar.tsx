/**
 * [Navbar.tsx]
 * 사이트 상단의 네비게이션 바(헤더)를 담당하는 컴포넌트입니다.
 * - 로고 및 홈 이동 링크
 * - 테마 변경 (Theme Switcher)
 * - 언어 변경 (Language Switcher)
 * - 로그인/회원가입 또는 유저 환영 메시지 및 로그아웃 버튼
 */
"use client";

import React, { useState, useRef, useEffect } from "react";
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

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 모바일 메뉴 닫기 방지
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-[var(--card-bg)] shadow-sm sticky top-0 z-[100] w-full transition-all duration-300 border-b border-[var(--border)]">
            <div className="max-w-[1200px] mx-auto px-4 py-3 flex justify-between items-center w-full">
                {/* 로고: 클릭 시 메인 페이지로 이동 */}
                <Link href="/" className="text-2xl font-extrabold text-[var(--primary)] no-underline flex items-center gap-1 md:gap-2 shrink-0">
                    <span>📚</span>
                    <span className="hidden md:inline-block">{SITE_NAME}</span>
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
                        className="w-24 md:w-28 mr-1 md:mr-4"
                    />

                    {/* 로그인 상태에 따른 UI 분기 처리 */}
                    {user ? (
                        <>
                            {/* 데스크탑 버젼 */}
                            <div className="hidden md:flex items-center gap-2">
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
                            </div>

                            {/* 모바일 버젼 (드롭다운) */}
                            <div className="md:hidden relative flex items-center" ref={mobileMenuRef}>
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-1.5 border-2 border-[var(--border)] rounded-full hover:bg-[var(--background)] transition-colors flex items-center justify-center text-lg shadow-sm"
                                >
                                    👤
                                </button>

                                {isMobileMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-36 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-[var(--card-shadow)] flex flex-col overflow-hidden z-[110] animate-slideDown">
                                        <Link
                                            href="/mypage"
                                            className="px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background)] border-b border-[var(--border)] text-center transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {t.nav.myPage}
                                        </Link>
                                        {user.role === "ADMIN" && (
                                            <Link
                                                href="/admin"
                                                className="px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 border-b border-[var(--border)] text-center transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {t.nav.admin}
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="px-4 py-3 text-sm font-medium text-[var(--danger)] hover:bg-red-50 text-center w-full transition-colors"
                                        >
                                            {t.nav.logout}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // 비로그인 상태일 때 로그인 버튼 표시
                        <div className="flex gap-2 items-center">
                            <Link href="/login" className="btn btn-primary no-underline text-xs md:text-base px-3 py-1.5 md:px-4 md:py-2">
                                {t.nav.login}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
