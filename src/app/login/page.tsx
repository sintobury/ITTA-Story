"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const { loginAsUser, loginAsAdmin } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Login Logic
        if (id === "admin" && password === "admin") {
            loginAsAdmin();
        } else {
            // Treat any other input as a normal user for now
            loginAsUser();
        }
        router.push("/");
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>{t.auth.loginTitle}</h1>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t.auth.id}</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder={t.auth.idPlaceholder}
                            className={styles.input}
                            required
                        />
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

                    <button type="submit" className={styles.submitBtn}>
                        {t.auth.loginBtn}
                    </button>
                </form>

                <div className={styles.footer}>
                    {t.auth.noAccount}
                    <Link href="/signup" className={styles.link}>
                        {t.auth.signupBtn}
                    </Link>
                </div>
            </div>
        </div>
    );
}
