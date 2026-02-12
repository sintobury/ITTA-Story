"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";

export default function CopyrightWarning() {
    const { t } = useLanguage();

    return (
        <div className="text-[var(--secondary)] text-sm opacity-70 text-center py-6 border-b border-[var(--border)] mb-6">
            {t.bookDetail.copyrightWarning}
        </div>
    );
}
