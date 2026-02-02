/**
 * [ThemeContext.tsx]
 * 앱의 디자인 테마(기본, 모던, 파스텔, 동화 등)를 관리하는 컨텍스트 파일입니다.
 * 사용자가 선택한 테마 값을 HTML의 data-theme 속성에 적용하여 CSS 스타일을 전역적으로 변경합니다.
 */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 사용 가능한 테마 목록 정의
export type Theme = 'default' | 'modern' | 'pastel' | 'green' | 'blue' | 'midnight' | 'classic' | 'fairy';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 테마 제공자: 앱 전체에서 테마 상태를 관리
export function ThemeProvider({ children }: { children: ReactNode }) {
    // 기본 테마를 'green' (녹색 파스텔)으로 설정
    const [theme, setTheme] = useState<Theme>('green');

    useEffect(() => {
        // 테마가 변경될 때마다 HTML 태그의 data-theme 속성을 업데이트하여 CSS가 적용되게 함
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 커스텀 훅: 컴포넌트에서 쉽게 테마를 가져오고 변경할 수 있게 함
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
