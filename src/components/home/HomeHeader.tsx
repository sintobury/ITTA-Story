"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function HomeHeader() {
    const { t } = useLanguage();

    return (
        <header className="text-center mb-6 md:mb-8 transition-all duration-300 group">
            <h1 className="text-[2rem] md:text-[2.5rem] font-bold mb-2 text-[var(--foreground)] transition-colors">{t.home.welcome}</h1>
            <p className="text-[0.95rem] md:text-base text-[var(--secondary)]">{t.home.subtitle}</p>
        </header>
    );
}
