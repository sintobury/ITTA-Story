"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function HomeNoResults() {
    const { t } = useLanguage();

    return (
        <div className="text-center py-20 text-[var(--secondary)]">
            <h2 className="text-xl font-medium mb-2">{t.home.noResults}</h2>
            <p>{t.home.tryAgain}</p>
        </div>
    );
}
