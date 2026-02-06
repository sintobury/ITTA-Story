/**
 * [page.tsx] (Home)
 * 사이트의 메인 홈 페이지입니다.
 * - 등록된 책을 페이지네이션하여 보여줍니다. (페이지당 8개)
 * - 2열 그리드 레이아웃과 가로형 카드 스타일을 적용했습니다.
 * - URL Query Parameter(?page=)를 사용하여 페이지 상태를 관리합니다.
 */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { mockBooks, getLocalizedBook } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { Suspense } from "react";

const ITEMS_PER_PAGE = 8;

function HomeContent() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 page 파라미터 가져오기 (기본값 1)
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  // 전체 책 데이터 (Mock Data)
  const allBooks = mockBooks;
  const totalPages = Math.ceil(allBooks.length / ITEMS_PER_PAGE);

  // 현재 페이지 유효성 검사 및 리다이렉트 처리 (필요시)
  // 여기서는 렌더링 시 범위 보정만 수행
  const safePage = Math.max(1, Math.min(currentPage, totalPages));

  // 현재 페이지에 표시할 책 데이터 슬라이싱
  const currentBooks = allBooks.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`/?page=${page}`);
  };

  return (
    <div className="py-4 transition-all duration-300">
      {/* 헤더 섹션 */}
      <header className="text-center mb-12 transition-all duration-300 group">
        <h1 className="text-[2.5rem] mb-2 text-[var(--foreground)] transition-colors">{t.home.welcome}</h1>
        <p className="text-[var(--secondary)]">{t.home.subtitle}</p>
      </header>

      {/* 책 리스트 그리드 섹션 (2열, 반응형) */}
      <div key={currentPage} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fadeIn">
        {currentBooks.map((book) => {
          const localizedBook = getLocalizedBook(book, language);

          return (
            <Link href={`/books/${book.id}`} key={book.id}
              /* 가로형 카드 레이아웃 적용 */
              className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-[var(--card-shadow)] transition-all duration-[400ms] cubic-bezier(0.25,0.8,0.25,1) flex flex-row relative no-underline text-inherit group hover:rotate-1 hover:scale-102 hover:shadow-xl hover:z-10 hover:-translate-y-1 h-[280px] [backface-visibility:hidden] [transform:translateZ(0)]"
            >
              {/* 이미지 영역 (2/3) */}
              <div className="w-2/3 h-full overflow-hidden bg-gray-100 relative rounded-l-xl">
                <img
                  src={localizedBook.coverUrl}
                  alt={localizedBook.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:contrast-[1.05]"
                />
                {/* 좋아요 뱃지 */}
                {book.likes > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 z-10 backdrop-blur-sm">
                    <span>❤️</span> {book.likes}
                  </div>
                )}
              </div>

              {/* 정보 영역 (1/3) */}
              <div className="w-1/3 p-6 flex flex-col justify-center border-l border-[var(--border)] rounded-r-xl">
                <h2 className="text-[1.5rem] font-bold mb-3 leading-tight overflow-hidden text-ellipsis line-clamp-3 text-[var(--foreground)]">
                  {localizedBook.title}
                </h2>
                <p className="text-[0.95rem] text-[var(--secondary)] font-medium">
                  {localizedBook.author}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 페이지네이션 컨트롤 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 pb-8 flex-wrap">
          {/* First Page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={safePage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:text-white hover:border-transparent transition-all"
            aria-label="First Page"
          >
            &lt;&lt;
          </button>

          {/* Prev Page */}
          <button
            onClick={() => handlePageChange(safePage - 1)}
            disabled={safePage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:text-white hover:border-transparent transition-all"
            aria-label="Previous Page"
          >
            &lt;
          </button>

          {/* Page Numbers (Windowed: Current +/- 2) */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => page >= safePage - 2 && page <= safePage + 2)
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${safePage === page
                  ? "bg-[var(--primary)] text-white shadow-md scale-110 border-transparent"
                  : "bg-[var(--card-bg)] border border-[var(--border)] text-[var(--secondary)] hover:bg-[var(--background)]"
                  }`}
              >
                {page}
              </button>
            ))}

          {/* Next Page */}
          <button
            onClick={() => handlePageChange(safePage + 1)}
            disabled={safePage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:text-white hover:border-transparent transition-all"
            aria-label="Next Page"
          >
            &gt;
          </button>

          {/* Last Page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={safePage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:text-white hover:border-transparent transition-all"
            aria-label="Last Page"
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
}

// Skeleton UI Component
function HomeSkeleton() {
  return (
    <div className="py-4">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse" />
        <div className="h-6 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <div key={i} className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-sm flex flex-row h-[280px] border border-[var(--border)]">
            {/* Image Skeleton */}
            <div className="w-2/3 h-full bg-gray-200 animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.5s_infinite]" style={{ backgroundSize: '200% 100%' }} />
            </div>
            {/* Content Skeleton */}
            <div className="w-1/3 p-6 flex flex-col justify-center border-l border-[var(--border)]">
              <div className="h-8 w-full bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="h-8 w-2/3 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Suspense Boundary for useSearchParams use client component
export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
