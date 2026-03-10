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
            <div className="flex flex-row flex-nowrap gap-2 md:gap-4 mb-8 md:mb-10 max-w-[1000px] mx-auto w-full">
                {/* 검색 그룹 */}
                <div className="flex-auto md:flex-1 flex items-center bg-[var(--card-bg)] rounded-xl md:rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border)] focus-within:ring-2 ring-[var(--primary)] ring-opacity-30 transition-all min-w-0">
                    <div className="flex items-center border-r border-[var(--border)] mr-1 md:mr-4 h-full shrink-0">
                        <Select
                            value={filterType}
                            onChange={(val) => setFilterType(val)}
                            variant="ghost"
                            options={[
                                { label: t.home.filter.title, value: 'title' },
                                { label: t.home.filter.author, value: 'author' }
                            ]}
                            width="w-full"
                            alignText="center"
                            className="min-w-[65px] md:min-w-[90px] !pl-2 md:!pl-6 !py-2 md:!py-3 rounded-l-xl md:rounded-l-2xl text-xs md:text-base border-none"
                        />
                    </div>
                    <Input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.home.searchPlaceholder}
                        className="flex-1 bg-transparent px-2 md:px-4 py-2 md:py-3 border-none shadow-none focus:shadow-none focus:border-none focus:ring-0 text-[var(--foreground)] text-xs md:text-base placeholder-[var(--secondary)] rounded-none min-w-0"
                    />
                    <Button
                        onClick={handleSearch}
                        variant="ghost"
                        className="w-8 md:w-12 h-8 md:h-11 mr-1 rounded-lg md:rounded-xl hover:bg-[var(--background)] active:scale-95 text-[var(--secondary)] hover:text-[var(--primary)] !p-0 flex items-center justify-center shrink-0"
                    >
                        🔍
                    </Button>
                </div>

                {/* 정렬 그룹 */}
                <div className="flex-none bg-[var(--card-bg)] rounded-xl md:rounded-2xl shadow-[var(--card-shadow)] border border-[var(--border)] flex items-center shrink-0">
                    <Select
                        value={sortOrder}
                        onChange={handleSortChange}
                        variant="ghost"
                        options={[
                            { label: t.home.sort.newest, value: 'newest' },
                            { label: t.home.sort.oldest, value: 'oldest' },
                            { label: t.home.sort.popular, value: 'popular' }
                        ]}
                        icon={<span className="text-xs md:text-base">⇅</span>}
                        alignText="center"
                        className="!py-2 md:!py-3 rounded-xl md:rounded-2xl text-xs md:text-base !pl-6 md:!pl-8 border-none"
                    />
                </div>
            </div>
        </>
    );
}
