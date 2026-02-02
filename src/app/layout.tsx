/**
 * [layout.tsx]
 * Next.js의 Root Layout 파일입니다.
 * - 모든 페이지에 공통적으로 적용되는 레이아웃을 정의합니다.
 * - 폰트(Gowun Dodum) 설정 및 전역 Context Provider(Auth, Theme, Language)를 감싸는 역할을 합니다.
 */
import type { Metadata } from "next";
import { Gowun_Dodum } from "next/font/google"; // 동화 같은 느낌의 귀여운 폰트 (고운 돋움)
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { BlockedUserProvider } from "@/context/BlockedUserContext";
import { ThemeProvider } from "@/context/ThemeContext";

// 폰트 설정 (하위 컴포넌트에 자동 적용됨)
const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "E-Library",
  description: "A clean and simple electronic library.",
};

// 최상위 레이아웃 컴포넌트: 모든 페이지에 공통으로 적용됩니다.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={gowunDodum.className}>
        {/* 전역 상태 관리자들 (로그인, 언어, 테마 등) */}
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <BlockedUserProvider>
                {/* 상단 네비게이션 바 */}
                <Navbar />
                {/* 페이지 본문이 표시되는 영역 */}
                <main className="container" style={{ paddingBottom: "2rem" }}>
                  {children}
                </main>
              </BlockedUserProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
