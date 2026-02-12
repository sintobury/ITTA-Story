/**
 * [page.tsx] (Home)
 * 사이트의 메인 홈 페이지입니다.
 * - 등록된 책을 페이지네이션하여 보여줍니다. (페이지당 8개)
 * - [검색] 제목/작가 기준 검색 기능을 제공합니다.
 * - [정렬] 최신순/과거순/인기순 정렬 기능을 제공합니다.
 */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { mockBooks, getLocalizedBook } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";

const ITEMS_PER_PAGE = 8;

function HomeContent() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터
  const pageParam = searchParams.get("page");
  const searchQuery = searchParams.get("q") || "";
  const searchType = searchParams.get("type") || "title"; // 제목 | 작가
  const sortOrder = searchParams.get("sort") || "newest"; // 최신순 | 과거순 | 인기순

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  // 검색 입력을 위한 로컬 상태 (Controlled Input)
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState("title");
  const [mounted, setMounted] = useState(false);

  // 로컬 상태와 URL 파라미터 동기화 (마운트 후 실행하여 Hydration Mismatch 방지)
  useEffect(() => {
    setKeyword(searchQuery);
    setFilterType(searchType);
    setMounted(true);
  }, [searchQuery, searchType]);

  // 서버 사이드 렌더링 시(또는 마운트 전)에는 기본 상태(전체 목록, 최신순)를 유지해야 함
  // 클라이언트 마운트 후에만 URL 파라미터에 따른 필터/정렬을 적용

  const handleSearch = () => {
    router.push(`/?page=1&q=${encodeURIComponent(keyword)}&type=${filterType}&sort=${sortOrder}`);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}&q=${encodeURIComponent(searchQuery)}&type=${searchType}&sort=${sortOrder}`);
  };

  // 1. 필터링
  const filteredBooks = mockBooks.filter((book) => {
    // 마운트 전에는 필터링 하지 않음 (서버와 일치시키기 위해)
    if (!mounted) return true;

    const query = searchQuery.toLowerCase();
    const localized = getLocalizedBook(book, language);
    if (!query) return true;

    if (searchType === "author") {
      return localized.author.toLowerCase().includes(query);
    }
    // 기본값: 제목
    return localized.title.toLowerCase().includes(query);
  });

  // 2. 정렬
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    // 마운트 전에는 기본 정렬(최신순)을 따름 (서버와 일치시키기 위해)
    if (!mounted) {
      return parseInt(b.id) - parseInt(a.id);
    }

    if (sortOrder === "popular") {
      return b.likes - a.likes; // 좋아요 내림차순
    }
    if (sortOrder === "oldest") {
      return parseInt(a.id) - parseInt(b.id); // ID 오름차순 (과거순)
    }
    // 기본값: 최신순
    return parseInt(b.id) - parseInt(a.id); // ID 내림차순 (최신순)
  });

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / ITEMS_PER_PAGE));
  const safePage = Math.max(1, Math.min(currentPage, totalPages));

  // 3. 페이지네이션
  const currentBooks = sortedBooks.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className="py-4 transition-all duration-300">
      {/* 헤더 섹션 */}
      <header className="text-center mb-8 transition-all duration-300 group">
        <h1 className="text-[2.5rem] mb-2 text-[var(--foreground)] transition-colors">{t.home.welcome}</h1>
        <p className="text-[var(--secondary)]">{t.home.subtitle}</p>
      </header>

      {/* 검색 및 정렬 컨트롤 바 */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-[1000px] mx-auto">
        {/* 검색 그룹 (통합 검색 바) */}
        <div className="flex-1 flex items-center bg-[var(--card-bg)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border)] focus-within:ring-2 ring-[var(--primary)] ring-opacity-30 transition-all">
          <div className="flex items-center border-r border-[var(--border)] mr-4 h-full">
            <Select
              value={filterType}
              onChange={(val) => setFilterType(val)}
              variant="ghost"
              options={[
                { label: t.home.filter.title, value: 'title' },
                { label: t.home.filter.author, value: 'author' }
              ]}
              width="w-full"
              className="min-w-[70px] !pl-6 !py-3 rounded-l-2xl"
            />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.home.searchPlaceholder}
            className="flex-1 bg-transparent px-4 py-3 outline-none text-[var(--foreground)] text-base placeholder-[var(--secondary)]"
          />
          <Button
            onClick={handleSearch}
            variant="ghost"
            className="w-12 h-11 mr-1 rounded-xl hover:bg-[var(--background)] active:scale-95 text-[var(--secondary)] hover:text-[var(--primary)]"
          >
            🔍
          </Button>
        </div>

        {/* 정렬 그룹 (독립된 정렬 드롭다운) */}
        <div className="md:w-48 bg-[var(--card-bg)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border)] flex items-center">
          <Select
            value={sortOrder}
            onChange={(val) => {
              // Directly trigger sort change
              router.push(`/?page=1&q=${encodeURIComponent(searchQuery)}&type=${searchType}&sort=${val}`);
            }}
            variant="ghost"
            options={[
              { label: t.home.sort.newest, value: 'newest' },
              { label: t.home.sort.oldest, value: 'oldest' },
              { label: t.home.sort.popular, value: 'popular' }
            ]}
            icon={<span>⇅</span>}
            width="w-full"
            className="!py-3 w-full rounded-2xl"
          />
        </div>
      </div>

      {/* 검색 결과 없음 메시지 */}
      {sortedBooks.length === 0 && (
        <div className="text-center py-20 text-[var(--secondary)]">
          <h2 className="text-xl font-medium mb-2">{t.home.noResults}</h2>
          <p>{t.home.tryAgain}</p>
        </div>
      )}

      {/* 책 리스트 그리드 섹션 */}
      <div key={`${safePage}-${sortOrder}-${searchQuery}`} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fadeIn">
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
          <Button
            onClick={() => handlePageChange(1)}
            disabled={safePage === 1}
            variant="secondary"
            className="w-10 h-10 rounded-full !p-0 border-[var(--border)] hover:border-transparent"
            aria-label="First Page"
          >
            &lt;&lt;
          </Button>

          {/* Prev Page */}
          <Button
            onClick={() => handlePageChange(safePage - 1)}
            disabled={safePage === 1}
            variant="secondary"
            className="w-10 h-10 rounded-full !p-0 border-[var(--border)] hover:border-transparent"
            aria-label="Previous Page"
          >
            &lt;
          </Button>

          {/* Page Numbers (Windowed: Current +/- 2) */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => page >= safePage - 2 && page <= safePage + 2)
            .map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={safePage === page ? 'primary' : 'secondary'}
                className={`w-10 h-10 rounded-full !p-0 transition-all ${safePage === page ? 'scale-110 shadow-md' : 'border-[var(--border)] hover:bg-[var(--background)]'}`}
              >
                {page}
              </Button>
            ))}

          {/* Next Page */}
          <Button
            onClick={() => handlePageChange(safePage + 1)}
            disabled={safePage === totalPages}
            variant="secondary"
            className="w-10 h-10 rounded-full !p-0 border-[var(--border)] hover:border-transparent"
            aria-label="Next Page"
          >
            &gt;
          </Button>

          {/* Last Page */}
          <Button
            onClick={() => handlePageChange(totalPages)}
            disabled={safePage === totalPages}
            variant="secondary"
            className="w-10 h-10 rounded-full !p-0 border-[var(--border)] hover:border-transparent"
            aria-label="Last Page"
          >
            &gt;&gt;
          </Button>
        </div>
      )}
    </div>
  );
}

// 스켈레톤 UI 컴포넌트
function HomeSkeleton() {
  return (
    <div className="py-4">
      {/* 헤더 스켈레톤 */}
      <div className="text-center mb-12">
        <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse" />
        <div className="h-6 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse" />
      </div>

      {/* 검색 바 스켈레톤 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-[var(--card-bg)] p-4 rounded-xl shadow-[var(--card-shadow)] border border-[var(--border)] animate-pulse">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="w-16 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1 md:w-64 h-10 bg-gray-200 rounded-lg" />
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        </div>
        <div className="w-full md:w-auto flex justify-end">
          <div className="w-24 h-10 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* 그리드 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <div key={i} className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-sm flex flex-row h-[280px] border border-[var(--border)]">
            {/* 이미지 스켈레톤 */}
            <div className="w-2/3 h-full bg-gray-200 animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.5s_infinite]" style={{ backgroundSize: '200% 100%' }} />
            </div>
            {/* 콘텐츠 스켈레톤 */}
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

// useSearchParams를 사용하는 클라이언트 컴포넌트를 위한 Suspense 경계
export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
