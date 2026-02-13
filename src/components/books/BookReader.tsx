"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Page } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";

// PageImage 컴포넌트
function PageImage({ src, alt }: { src: string; alt: string }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`relative w-full h-full rounded-lg overflow-hidden ${isLoading ? 'bg-[#f3f4f6]' : 'bg-transparent'}`}>
            {isLoading && <div className="absolute top-0 left-0 w-full h-full bg-gray-200 animate-pulse z-10" />}
            <img
                src={src}
                alt={alt}
                className={`block w-full h-full object-contain rounded-lg transition-opacity duration-700 ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}

interface BookReaderProps {
    pages: Page[];
    onClose: () => void;
    onTriggerToast: (message: string) => void;
}

export default function BookReader({ pages, onClose, onTriggerToast }: BookReaderProps) {
    const { t } = useLanguage();
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const warnMessage = t.bookDetail.copyrightWarning;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleSelectStart = (e: Event) => {
            e.preventDefault();
            // 드래그/선택 시에는 토스트를 띄우지 않고 조용히 막음
        };

        // TypeScript defines 'selectstart' as a valid event on GlobalEventHandlers, but sometimes misses it on elements.
        // We attach it manually here.
        container.addEventListener('selectstart', handleSelectStart);
        return () => {
            container.removeEventListener('selectstart', handleSelectStart);
        };
    }, []);

    return (
        // 읽기 모드: 드래그 방지(select-none) 및 우클릭 방지(onContextMenu) 적용
        <div
            ref={containerRef}
            className="w-fit mx-auto min-h-[80vh] flex flex-col items-center relative select-none"
            onContextMenu={(e) => {
                e.preventDefault();
                onTriggerToast(t.bookDetail.rightClickWarning);
            }}
            onDragStart={(e) => {
                e.preventDefault();
                // 드래그 시에는 토스트를 띄우지 않고 조용히 막음
            }}
        >
            <div className="w-full flex justify-end mb-3">
                <button
                    onClick={onClose}
                    className="bg-white py-2.5 px-5 rounded-full border border-[var(--border)] font-medium cursor-pointer shadow-sm transition-all text-sm text-[var(--foreground)] flex items-center gap-2 hover:bg-[#f8f9fa] hover:-translate-y-0.5 hover:shadow-md hover:text-[var(--primary)] hover:border-[var(--primary)]"
                >
                    ← {t.bookDetail.closeBook}
                </button>
                {/* Space holder for alignment: width of arrow button + margin */}
                <div className="w-[50px] mx-6" aria-hidden="true" />
            </div>

            <div className="flex items-center justify-center gap-0 my-0 mb-8 perspective-[1500px]">
                {/* 왼쪽 이동 버튼 */}
                <button
                    onClick={() => {
                        setDirection('prev');
                        setCurrentPageIndex(p => Math.max(0, p - 1));
                    }}
                    className="bg-white/80 border border-[var(--border)] rounded-full w-[50px] h-[50px] flex items-center justify-center text-2xl cursor-pointer transition-all shadow-md mx-6 text-[var(--primary)] z-20 hover:bg-[var(--primary)] hover:text-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:bg-[#eee]"
                    disabled={currentPageIndex === 0}
                >
                    ‹
                </button>

                {/* 왼쪽 페이지 (이미지 영역) */}
                <div
                    className={`
                        w-[450px] h-[560px] flex flex-col justify-between origin-center-bottom bg-[#fffbf0] p-0 border border-[#f0e6d2] relative transition-transform shadow-md duration-200
                        rounded-l-xl rounded-r-sm shadow-[inset_-15px_0_20px_rgba(0,0,0,0.03),_-5px_5px_15px_rgba(0,0,0,0.1)] border-r-0 origin-right overflow-hidden
                        ${direction === 'prev' ? 'animate-flipInLeft' : ''} 
                    `}
                >
                    <div className="flex-1 flex flex-col items-center justify-center h-full w-full p-6">
                        {pages[currentPageIndex]?.imageUrl ? (
                            <PageImage src={pages[currentPageIndex].imageUrl!} alt="Page illustration" />
                        ) : (
                            <div className="w-full h-full" />
                        )}
                    </div>
                </div>

                {/* 책등 */}
                <div className="w-[2px] h-[540px] bg-[#d1d5db] shadow-inner z-10"></div>

                {/* 오른쪽 페이지 (텍스트 영역) */}
                <div
                    className={`
                        w-[450px] h-[560px] flex flex-col justify-between origin-center-bottom bg-[#fffbf0] p-12 pb-8 border border-[#f0e6d2] relative transition-transform shadow-md duration-200
                        rounded-r-xl rounded-l-sm shadow-[inset_15px_0_20px_rgba(0,0,0,0.03),_5px_5px_15px_rgba(0,0,0,0.1)] border-l-0 origin-left
                        ${direction === 'next' ? 'animate-flipInRight' : ''}
                    `}
                >
                    <div className="flex-1 flex flex-col items-center justify-center text-center perspective-[1000px] overflow-hidden">
                        {pages[currentPageIndex]?.content ? (
                            <>
                                {/* HTML 태그 렌더링 (dangerouslySetInnerHTML) */}
                                <div
                                    className="text-xl leading-[1.8] max-w-[360px] w-full ql-editor-content break-keep text-left"
                                    dangerouslySetInnerHTML={{ __html: pages[currentPageIndex].content }}
                                />
                                <style jsx>{`
                                    /* Quill 에디터 스타일 복원 */
                                    .ql-editor-content :global(p) { margin-bottom: 1em; }
                                    .ql-editor-content :global(h1), .ql-editor-content :global(h2), .ql-editor-content :global(h3) { margin-bottom: 0.5em; font-weight: bold; }
                                    .ql-editor-content :global(strong) { font-weight: bold; }
                                    .ql-editor-content :global(em) { font-style: italic; }
                                    .ql-editor-content :global(u) { text-decoration: underline; }
                                    .ql-editor-content :global(s) { text-decoration: line-through; }
                                    .ql-editor-content :global(ul), .ql-editor-content :global(ol) { margin-left: 1.5em; margin-bottom: 1em; text-align: left; }
                                    .ql-editor-content :global(li) { list-style: inherit; }
                                `}</style>
                            </>
                        ) : (
                            <div className="w-full h-full" />
                        )}
                    </div>
                    <div className="w-full flex justify-center text-sm text-[var(--secondary)] pt-4">
                        - {currentPageIndex + 1} -
                    </div>
                </div>

                {/* 오른쪽 이동 버튼 */}
                <button
                    onClick={() => {
                        setDirection('next');
                        setCurrentPageIndex(p => Math.min(pages.length - 1, p + 1));
                    }}
                    className="bg-white/80 border border-[var(--border)] rounded-full w-[50px] h-[50px] flex items-center justify-center text-2xl cursor-pointer transition-all shadow-md mx-6 text-[var(--primary)] z-20 hover:bg-[var(--primary)] hover:text-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:bg-[#eee]"
                    disabled={currentPageIndex >= pages.length - 1}
                >
                    ›
                </button>
            </div>
        </div>
    );
}
