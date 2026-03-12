"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="mt-auto py-8 bg-[var(--card-bg)] border-t border-[var(--border)] relative z-10 w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* 로고 영역 */}
                <div className="flex items-center">
                    <span 
                        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-purple-400"
                        style={{ fontFamily: "inherit" }}
                    >
                        {SITE_NAME}
                    </span>
                </div>

                {/* 저작권 문구 영역 */}
                <div className="text-sm text-[var(--text-secondary)] text-center sm:text-right">
                    {t.footer.copyright}
                </div>
            </div>
        </footer>
    );
}
