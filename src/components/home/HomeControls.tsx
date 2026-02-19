"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { Input } from "@/components/common/Input";

export default function HomeControls() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL 파라미터 초기값

    const [keyword, setKeyword] = useState(searchParams.get("q") || "");
    const [filterType, setFilterType] = useState(searchParams.get("type") || "title");
    const [sortOrder, setSortOrder] = useState(searchParams.get("sort") || "newest");

    // URL 변경 감지하여 상태 동기화 (뒤로가기 등 지원)
    useEffect(() => {
        // eslint-disable-next-line
        setKeyword(searchParams.get("q") || "");
        setFilterType(searchParams.get("type") || "title");
        setSortOrder(searchParams.get("sort") || "newest");
    }, [searchParams]);

    const handleSearch = () => {
        // 검색 시 페이지는 1로 초기화
        router.push(`/?page=1&q=${encodeURIComponent(keyword)}&type=${filterType}&sort=${sortOrder}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSortChange = (val: string) => {
        setSortOrder(val);
        // 정렬 변경 시 바로 적용
        router.push(`/?page=1&q=${encodeURIComponent(keyword)}&type=${filterType}&sort=${val}`);
    };

    return (
        <>
            {/* 검색 및 정렬 컨트롤 바 */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-[1000px] mx-auto">
                {/* 검색 그룹 */}
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
                    <Input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.home.searchPlaceholder}
                        className="flex-1 bg-transparent px-4 py-3 border-none shadow-none focus:shadow-none focus:border-none focus:ring-0 text-[var(--foreground)] text-base placeholder-[var(--secondary)] rounded-none"
                    />
                    <Button
                        onClick={handleSearch}
                        variant="ghost"
                        className="w-12 h-11 mr-1 rounded-xl hover:bg-[var(--background)] active:scale-95 text-[var(--secondary)] hover:text-[var(--primary)]"
                    >
                        🔍
                    </Button>
                </div>

                {/* 정렬 그룹 */}
                <div className="md:w-48 bg-[var(--card-bg)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border)] flex items-center">
                    <Select
                        value={sortOrder}
                        onChange={handleSortChange}
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
        </>
    );
}
