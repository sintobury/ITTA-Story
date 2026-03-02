/**
 * [LanguageContext.tsx]
 * 다국어(한국어, 영어) 지원 기능을 관리하는 컨텍스트 파일입니다.
 * 사용자가 선택한 언어에 따라 앱 전체의 텍스트(translations.ts)를 실시간으로 변경해줍니다.
 */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language } from "@/lib/translations";

export interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations['en']; // 자동 완성을 위한 타입 헬퍼
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('ko'); // 기본 언어를 한국어로 설정

    // 마운트 시 저장된 언어 불러오기
    useEffect(() => {
        const savedLang = localStorage.getItem('NEXT_LOCALE') as Language;
        if (savedLang && (savedLang === 'ko' || savedLang === 'en')) {
            setLanguage(savedLang);
        } else {
            // 쿠키에서 확인 (초기 접속 시)
            const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
            if (match && (match[2] === 'ko' || match[2] === 'en')) {
                setLanguage(match[2] as Language);
            }
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('NEXT_LOCALE', lang);
        document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`; // 1년 유지
    };

    const value = {
        language,
        setLanguage: handleSetLanguage,
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
