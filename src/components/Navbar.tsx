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
import { useTheme, Theme } from "@/context/ThemeContext";
import styles from "./Navbar.module.css";
import { Language } from "@/lib/translations";

export default function Navbar() {
    // 커스텀 훅을 사용하여 전역 상태(로그인, 언어, 테마)를 가져옴
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const { theme, setTheme } = useTheme();

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                {/* 로고: 클릭 시 메인 페이지로 이동 */}
                <Link href="/" className={styles.logo}>
                    📚 E-Library
                </Link>

                <div className={styles.actions}>
                    {/* 테마 선택 드롭다운 (기본, 모던, 파스텔, 그린, 블루 등) */}
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as Theme)}
                        className={styles.langSelect}
                        style={{ marginRight: '0.5rem', padding: '0.4rem', borderRadius: '6px' }}
                    >
                        <option value="default">Default</option>
                        <option value="modern">Modern</option>
                        <option value="pastel">Pastel</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                        <option value="midnight">Midnight</option>
                        <option value="classic">Classic</option>
                        <option value="fairy">Fairytale</option>
                    </select>

                    {/* 언어 선택 드롭다운 */}
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className={styles.langSelect}
                        style={{ marginRight: '1rem', padding: '0.4rem', borderRadius: '6px' }}
                    >
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                        <option value="zh">中文</option>
                    </select>

                    {/* 로그인 상태에 따른 UI 분기 처리 */}
                    {user ? (
                        <>
                            <span className={styles.welcome}>
                                Hello, <strong>{user.name}</strong> ({user.role})
                            </span>
                            {/* 관리자(ADMIN)일 경우에만 관리자 페이지 링크 표시 */}
                            {user.role === "ADMIN" && (
                                <Link href="/admin" className="btn btn-secondary">
                                    관리자 페이지
                                </Link>
                            )}
                            <button onClick={logout} className="btn btn-secondary">
                                {user.role === "ADMIN" ? "로그아웃" : t.nav.logout}
                            </button>
                        </>
                    ) : (
                        // 비로그인 상태일 때 로그인/회원가입 버튼 표시
                        <div className={styles.authButtons}>
                            <Link href="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                {t.nav.login}
                            </Link>
                            <Link href="/signup" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                                {t.nav.signup}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
