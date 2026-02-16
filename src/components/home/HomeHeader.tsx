"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function HomeHeader() {
    const { t } = useLanguage();

    return (
        <header className="text-center mb-8 transition-all duration-300 group">
            <h1 className="text-[2.5rem] mb-2 text-[var(--foreground)] transition-colors">{t.home.welcome}</h1>
            <p className="text-[var(--secondary)]">{t.home.subtitle}</p>
        </header>
    );
}
