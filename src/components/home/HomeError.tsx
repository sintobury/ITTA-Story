"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function HomeError() {
    const { t } = useLanguage();

    return (
        <div className="text-center py-20 text-red-500">
            {t.home.fetchError}
        </div>
    );
}
