"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/common/Button";

interface HomePaginationProps {
    totalPages: number;
    currentPage: number;
}

export default function HomePagination({ totalPages, currentPage }: HomePaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    const safePage = Math.max(1, Math.min(currentPage, totalPages));

    return (
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
    );
}
