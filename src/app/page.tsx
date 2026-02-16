import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import HomeControls from "@/components/home/HomeControls";
import BookGrid from "@/components/home/BookGrid";
import HomePagination from "@/components/home/HomePagination";
import HomeHeader from "@/components/home/HomeHeader";

// Force Dynamic Rendering for Search Params
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
  const params = await searchParams; // Next.js 15: searchParams can be a Promise
  const query = params.q || "";
  const filterType = params.type || "title";
  const sortOrder = params.sort || "newest";
  const currentPage = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 8;

  // Build Supabase Query
  let dbQuery = supabase
    .from('books')
    .select('*', { count: 'exact' });

  // 1. Filtering
  if (query) {
    if (filterType === "author") {
      dbQuery = dbQuery.ilike('author', `%${query}%`);
    } else {
      // Default: Title
      dbQuery = dbQuery.ilike('title', `%${query}%`);
    }
  }

  // 2. Sorting
  if (sortOrder === "popular") {
    dbQuery = dbQuery.order('likes_count', { ascending: false });
  } else if (sortOrder === "oldest") {
    dbQuery = dbQuery.order('created_at', { ascending: true });
  } else {
    // Default: Newest
    dbQuery = dbQuery.order('created_at', { ascending: false });
  }

  // 3. Pagination
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  dbQuery = dbQuery.range(from, to);

  // Execute Fetch
  const { data: books, count, error } = await dbQuery;

  if (error) {
    console.error("Error fetching books:", error);
    return <div className="text-center py-20 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  // Transform DB data to Mock Data format (for compatibility)
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
        <div className="text-center py-20 text-[var(--secondary)]">
          <h2 className="text-xl font-medium mb-2">검색 결과가 없습니다.</h2>
          <p>다른 검색어나 필터를 시도해 보세요.</p>
        </div>
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
  // await searchParams in parent to pass to content
  const params = await searchParams;
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent searchParams={params} />
    </Suspense>
  );
}
