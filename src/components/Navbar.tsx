"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Navbar.module.css";
import { Language } from "@/lib/translations";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    📚 E-Library
                </Link>

                <div className={styles.actions}>
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

                    {user ? (
                        <>
                            <span className={styles.welcome}>
                                Hello, <strong>{user.name}</strong> ({user.role})
                            </span>
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
