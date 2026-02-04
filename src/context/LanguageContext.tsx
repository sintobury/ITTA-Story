/**
 * [LanguageContext.tsx]
 * 다국어(한국어, 영어, 일본어, 중국어) 지원 기능을 관리하는 컨텍스트 파일입니다.
 * 사용자가 선택한 언어에 따라 앱 전체의 텍스트(translations.ts)를 실시간으로 변경해줍니다.
 */
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { translations, Language } from "@/lib/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations['en']; // 자동 완성을 위한 타입 헬퍼
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('ko'); // 기본 언어를 한국어로 설정

    const value = {
        language,
        setLanguage,
        t: translations[language],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
