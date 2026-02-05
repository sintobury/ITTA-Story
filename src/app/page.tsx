/**
 * [page.tsx] (Home)
 * 사이트의 메인 홈 페이지입니다.
 * - 등록된 모든 책을 그리드 형태로 보여줍니다.
 * - 각 책의 표지, 제목, 저자, 좋아요 수를 표시합니다.
 */
"use client";

import Link from "next/link";
import { mockBooks, getLocalizedBook } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
// next/image를 사용하여 이미지 최적화 (실제 배포 시 권장)
// import Image from "next/image";

// 메인 함수: 클라이언트 컴포넌트로 데이터 페칭 및 렌더링 수행
export default function Home() {
  // 언어 설정 가져오기 (전역 상태)
  const { t, language } = useLanguage();

  // 실제 API 호출 대신 Mock Data 사용
  const books = mockBooks;

  return (
    <div className="py-4 transition-all duration-300">
      {/* 헤더 섹션: 사이트 제목 및 소개 (언어 설정에 따라 텍스트 변경) */}
      <header className="text-center mb-12 transition-all duration-300 group">
        {/* Global themes often target this header, kept simple here with Tailwind. 
                    If consistent 'theme' classes are needed, we rely on global.css variables or body classes.
                    For now, standardizing with Tailwind utility classes.
                */}
        <h1 className="text-[2.5rem] mb-2 text-[var(--foreground)] transition-colors">{t.home.welcome}</h1>
        <p className="text-[var(--secondary)]">{t.home.subtitle}</p>
      </header>

      {/* 책 리스트 그리드 섹션 */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-8 transition-all duration-300">
        {books.map((book) => {
          // 현재 언어 설정에 맞춰 책 정보를 번역된 상태로 변환
          const localizedBook = getLocalizedBook(book, language);

          return (
            <Link href={`/books/${book.id}`} key={book.id}
              className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-[var(--card-shadow)] transition-all duration-[400ms] cubic-bezier(0.25,0.8,0.25,1) flex flex-col relative no-underline text-inherit group hover:rotate-1 hover:scale-105 hover:shadow-xl hover:z-10 hover:-translate-y-1">
              <div className="w-full aspect-[2/3] overflow-hidden bg-gray-100 relative">
                <img
                  src={localizedBook.coverUrl}
                  alt={localizedBook.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:contrast-[1.05]"
                />

                {/* 좋아요 뱃지: 좋아요가 있을 경우에만 표시 */}
                {book.likes > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 z-10 backdrop-blur-sm">
                    <span>❤️</span> {book.likes}
                  </div>
                )}
              </div>

              {/* 책 정보 섹션 */}
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h2 className="text-[1.1rem] font-semibold mb-1 overflow-hidden whitespace-nowrap text-ellipsis text-[var(--foreground)]">
                  {localizedBook.title}
                </h2>
                <p className="text-sm text-[var(--secondary)]">{localizedBook.author}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
