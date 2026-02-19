import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import HomeControls from "@/components/home/HomeControls";
import BookGrid from "@/components/home/BookGrid";
import HomePagination from "@/components/home/HomePagination";
import HomeHeader from "@/components/home/HomeHeader";
import HomeNoResults from "@/components/home/HomeNoResults";
import HomeError from "@/components/home/HomeError";

// 검색 파라미터에 대한 동적 렌더링 강제
export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    sort?: string;
    page?: string;
  }>;
}

async function HomeContent({ searchParams }: { searchParams: Awaited<HomeProps['searchParams']> }) {
  const params = await searchParams; // Next.js 15: searchParams는 Promise일 수 있음
  const query = params.q || "";
  const filterType = params.type || "title";
  const sortOrder = params.sort || "newest";
  const currentPage = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 8;

  // Supabase 쿼리 빌드
  let dbQuery = supabase
    .from('books')
    .select('*', { count: 'exact' });

  // 1. 필터링 (Filtering)
  if (query) {
    if (filterType === "author") {
      dbQuery = dbQuery.ilike('author', `%${query}%`);
    } else {
      // 기본값: 제목 (Default: Title)
      dbQuery = dbQuery.ilike('title', `%${query}%`);
    }
  }

  // 2. 정렬 (Sorting)
  if (sortOrder === "popular") {
    dbQuery = dbQuery.order('likes_count', { ascending: false });
  } else if (sortOrder === "oldest") {
    dbQuery = dbQuery.order('created_at', { ascending: true });
  } else {
    // 기본값: 최신순 (Default: Newest)
    dbQuery = dbQuery.order('created_at', { ascending: false });
  }

  // 3. 페이지네이션 (Pagination)
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  dbQuery = dbQuery.range(from, to);

  // 쿼리 실행 (Execute Fetch)
  const { data: books, count, error } = await dbQuery;

  if (error) {
    console.error("Error fetching books:", error);
    return <HomeError />;
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  // DB 데이터를 Mock Data 형식으로 변환 (호환성 유지)
  // DB: cover_url, likes_count, available_languages, translations
  // App: coverUrl, likes, availableLanguages, translations
  const formattedBooks = books?.map(b => ({
    id: b.id,
    title: b.title,
    author: b.author,
    description: b.description,
    coverUrl: b.cover_url,
    likes: b.likes_count,
    availableLanguages: b.available_languages,
    translations: b.translations,
  })) || [];


  return (
    <div className="py-4 transition-all duration-300">
      <HomeHeader />

      <HomeControls />

      {formattedBooks.length === 0 ? (
        <HomeNoResults />
      ) : (
        <BookGrid books={formattedBooks} />
      )}

      <HomePagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="py-4 animate-pulse">
      <div className="h-32 mb-8 bg-gray-200 rounded-xl"></div>
      <div className="h-16 mb-10 bg-gray-200 rounded-xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[280px] bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  // 부모 컴포넌트에서 searchParams를 await하여 자식에게 전달
  const params = await searchParams;
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent searchParams={params} />
    </Suspense>
  );
}
