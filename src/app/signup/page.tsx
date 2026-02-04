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
import styles from "@/app/login/page.module.css"; // Reuse login styles

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
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>{t.auth.signupTitle}</h1>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t.auth.id}</label>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => {
                                    setId(e.target.value);
                                    setIsIdChecked(false);
                                    setIdMessage(null);
                                }}
                                placeholder={t.auth.idPlaceholder}
                                className={styles.input}
                                required
                            />
                            <button
                                type="button"
                                onClick={handleCheckDuplicate}
                                className={styles.checkBtn}
                            >
                                {t.auth.checkDuplicate}
                            </button>
                        </div>
                        {idMessage && (
                            <p className={idMessage.type === 'success' ? styles.successMsg : styles.errorMsg}>
                                {idMessage.text}
                            </p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t.auth.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t.auth.pwPlaceholder}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t.auth.nickname}</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder={t.auth.nickPlaceholder}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        {t.auth.signupBtn}
                    </button>
                </form>

                <div className={styles.footer}>
                    {t.auth.hasAccount}
                    <Link href="/login" className={styles.link}>
                        {t.auth.loginBtn}
                    </Link>
                </div>
            </div>
        </div>
    );
}
