"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";

interface HomePaginationProps {
    totalPages: number;
    currentPage: number;
}

export default function HomePagination({ totalPages, currentPage }: HomePaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    const safePage = Math.max(1, Math.min(currentPage, totalPages));

    return (
        <div className="flex justify-center items-center gap-2 mt-8 pb-8 flex-wrap">
            {/* 첫 페이지 */}
            <Button
                onClick={() => handlePageChange(1)}
                disabled={safePage === 1}
                variant="secondary"
                className="w-10 h-10 rounded-full !p-0 border-[var(--border)] hover:border-transparent"
                aria-label={t.home.pagination.firstPage}
            >
                &lt;&lt;
            </Button>

            {/* 이전 페이지 */}
            <Button
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                variant="secondary"
                className="w-10 h-10 rounded-full !p-0 border-[var(--border)] hover:border-transparent"
                aria-label={t.home.pagination.prevPage}
            >
                &lt;
            </Button>

            {/* 페이지 번호 (현재 페이지 기준 +/- 2) */}
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

            {/* 다음 페이지 */}
            <Button
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                variant="secondary"
                className="w-10 h-10 rounded-full !p-0 border-[var(--border)] hover:border-transparent"
                aria-label={t.home.pagination.nextPage}
            >
                &gt;
            </Button>

            {/* 마지막 페이지 */}
            <Button
                onClick={() => handlePageChange(totalPages)}
                disabled={safePage === totalPages}
                variant="secondary"
                className="w-10 h-10 rounded-full !p-0 border-[var(--border)] hover:border-transparent"
                aria-label={t.home.pagination.lastPage}
            >
                &gt;&gt;
            </Button>
        </div>
    );
}
