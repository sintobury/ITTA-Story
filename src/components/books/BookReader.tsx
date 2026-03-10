"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import { Page } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";
import { supabase } from "@/lib/supabase";

function PageImage({ src, alt }: { src: string; alt: string }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`relative w-full h-[40vh] md:h-full min-h-[300px] md:min-h-0 rounded-lg overflow-hidden shrink-0 ${isLoading ? 'bg-[#f3f4f6]' : 'bg-transparent'}`}>
            {isLoading && <div className="absolute top-0 left-0 w-full h-full bg-gray-200 animate-pulse z-10" />}
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-contain rounded-lg transition-opacity duration-700 mix-blend-multiply ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoading(false)}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
            />
        </div>
    );
}

interface BookReaderProps {
    pages: Page[];
    bookId: string; // 조회수 증가용
    onClose: () => void;
    onTriggerToast: (message: string) => void;
    initialPage?: number;
    onPageChange?: (pageIndex: number) => void;
}

export default function BookReader({ pages, bookId, onClose, onTriggerToast, initialPage = 0, onPageChange }: BookReaderProps) {
    const { t } = useLanguage();
    const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

    // 페이지 변경 시 부모에게 알림 (읽기 기록 저장용)
    useEffect(() => {
        if (onPageChange) {
            onPageChange(currentPageIndex);
        }
    }, [currentPageIndex, onPageChange]);
    const containerRef = useRef<HTMLDivElement>(null);

    const hasIncremented = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleSelectStart = (e: Event) => {
            e.preventDefault();
            // 드래그/선택 시에는 토스트를 띄우지 않고 조용히 막음
        };

        // TypeScript는 'selectstart'를 GlobalEventHandlers의 유효한 이벤트로 정의하지만, 
        // 때때로 요소에서 누락될 수 있어 수동으로 연결합니다.
        container.addEventListener('selectstart', handleSelectStart);

        // 조회수 증가 (컴포넌트 마운트 시 1회, Strict Mode 중복 방지)
        if (bookId && !hasIncremented.current) {
            hasIncremented.current = true;
            const incrementView = async () => {
                await supabase.rpc('increment_views', { book_id: bookId });
            };
            incrementView();
        }

        return () => {
            container.removeEventListener('selectstart', handleSelectStart);
        };
    }, [bookId]);

    return (
        // 읽기 모드: 드래그 방지(select-none) 및 우클릭 방지(onContextMenu) 적용
        <div
            ref={containerRef}
            className="w-full mx-auto min-h-[80vh] flex flex-col items-center relative select-none"
            onContextMenu={(e) => {
                e.preventDefault();
                onTriggerToast(t.rightClickWarning);
            }}
            onDragStart={(e) => {
                e.preventDefault();
                // 드래그 시에는 토스트를 띄우지 않고 조용히 막음
            }}
        >
            {/* 단일 중앙 컨테이너: 최대 너비 900px, 닫기 버튼과 책을 모두 포함 */}
            <div className="w-full max-w-[900px] flex flex-col px-3 md:px-0">
                {/* 헤더 영역: 닫기 버튼 (우측 상단 정렬) */}
                <div className="w-full flex justify-end mb-3">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="bg-white rounded-full hover:bg-[#f8f9fa] hover:text-[var(--primary)] text-sm py-2.5 px-5 h-auto z-20 shadow-sm"
                    >
                        ← {t.bookDetail.closeBook}
                    </Button>
                </div>

                {/* 책 본문 영역 */}
                <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 my-0 mb-8 min-h-[560px] w-full relative">

                    {/* 왼쪽 페이지 (이미지 영역) - 모바일 세로/데스크톱 가로 */}
                    <div
                        className="w-full md:w-1/2 min-w-0 flex flex-col justify-between bg-[#fffbf0] p-0 border border-[#f0e6d2] shadow-sm md:shadow-[inset_-15px_0_20px_rgba(0,0,0,0.03),_-3px_3px_0_#f4ebd8,_-4px_4px_0_#d1d5db,_-6px_6px_0_#f4ebd8,_-7px_7px_0_#d1d5db] rounded-t-xl md:rounded-l-xl md:rounded-tr-none border-b-0 md:border-b md:border-r-0 overflow-hidden shrink-0 relative"
                    >
                        {/* 데스크탑 왼쪽 이동 사이드바 버튼 (페이지 높이 전체 차지) */}
                        <button
                            onClick={() => {
                                setDirection('prev');
                                setCurrentPageIndex(p => Math.max(0, p - 1));
                            }}
                            className="hidden md:flex absolute left-0 top-0 h-full w-[40px] md:rounded-l-xl bg-transparent hover:bg-[var(--primary)]/5 hover:backdrop-blur-sm z-30 items-center justify-center transition-colors disabled:opacity-0 disabled:pointer-events-none group border-r border-transparent hover:border-[#f0e6d2]"
                            disabled={currentPageIndex === 0}
                            aria-label="Previous Page"
                        >
                            <span className="text-2xl text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors opacity-50 group-hover:opacity-100">
                                ‹
                            </span>
                        </button>

                        {/* 콘텐츠 페이드인 (패딩 영역 조정하여 버튼과 텍스트 안 겹치게) */}
                        <div key={`img-${currentPageIndex}`} className="flex-1 flex flex-col items-center justify-center h-full w-full p-4 md:py-6 md:pr-6 md:pl-12 animate-fadeIn">
                            {pages[currentPageIndex]?.imageUrl ? (
                                <PageImage src={pages[currentPageIndex].imageUrl!} alt={t.admin.uploadPage.labels.illustration} />
                            ) : (
                                <div className="w-full h-full" />
                            )}
                        </div>
                    </div>

                    {/* 데스크탑 책등 */}
                    <div className="hidden md:block w-[2px] bg-[#d1d5db] shadow-inner z-10 my-[10px]"></div>

                    {/* 모바일 가로 구분선 및 네비게이션 */}
                    <div className="flex md:hidden items-center justify-between w-full px-4 py-3 bg-[#fffbf0] border-x border-[#f0e6d2] z-20 shadow-[0_5px_10px_rgba(0,0,0,0.05)_z-10]">
                        <Button
                            onClick={() => {
                                setDirection('prev');
                                setCurrentPageIndex(p => Math.max(0, p - 1));
                            }}
                            variant="outline"
                            className="bg-white rounded-full w-[40px] h-[40px] p-0 text-xl shadow-sm border-[var(--border)] text-[var(--primary)] shrink-0 flex items-center justify-center"
                            disabled={currentPageIndex === 0}
                        >
                            ‹
                        </Button>
                        <div className="flex-1 h-[2px] bg-[#d1d5db] mx-6 rounded-full shadow-inner opacity-70"></div>
                        <Button
                            onClick={() => {
                                setDirection('next');
                                setCurrentPageIndex(p => Math.min(pages.length - 1, p + 1));
                            }}
                            variant="outline"
                            className="bg-white rounded-full w-[40px] h-[40px] p-0 text-xl shadow-sm border-[var(--border)] text-[var(--primary)] shrink-0 flex items-center justify-center"
                            disabled={currentPageIndex >= pages.length - 1}
                        >
                            ›
                        </Button>
                    </div>

                    {/* 오른쪽 페이지 (텍스트 영역) */}
                    <div
                        className="w-full md:w-1/2 min-w-0 flex flex-col justify-between bg-[#fffbf0] p-6 md:py-12 md:pl-12 md:pr-14 pb-6 border border-[#f0e6d2] shadow-sm md:shadow-[inset_15px_0_20px_rgba(0,0,0,0.03),_3px_3px_0_#f4ebd8,_4px_4px_0_#d1d5db,_6px_6px_0_#f4ebd8,_7px_7px_0_#d1d5db] rounded-b-xl md:rounded-r-xl md:rounded-bl-none border-t-0 md:border-t md:border-l-0 shrink-0 relative"
                    >
                        {/* 콘텐츠 페이드인 */}
                        <div key={`txt-${currentPageIndex}`} className="flex-1 flex flex-col items-center justify-center text-center overflow-hidden w-full animate-fadeIn">
                            {pages[currentPageIndex]?.content ? (
                                <>
                                    {/* HTML 태그 렌더링 (dangerouslySetInnerHTML) */}
                                    <div
                                        className="text-xl leading-[1.8] w-full ql-editor-content break-words text-left"
                                        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                                        dangerouslySetInnerHTML={{ __html: pages[currentPageIndex].content || "" }}
                                    />
                                    <style jsx>{`
                                    /* Quill 에디터 스타일 */
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
                        <div className="w-full flex justify-center text-sm text-[var(--secondary)] pt-4 mt-auto">
                            - {currentPageIndex + 1} -
                        </div>

                        {/* 데스크탑 오른쪽 이동 사이드바 버튼 (페이지 높이 전체 차지) */}
                        <button
                            onClick={() => {
                                setDirection('next');
                                setCurrentPageIndex(p => Math.min(pages.length - 1, p + 1));
                            }}
                            className="hidden md:flex absolute right-0 top-0 h-full w-[40px] md:rounded-r-xl bg-transparent hover:bg-[var(--primary)]/5 hover:backdrop-blur-sm z-30 items-center justify-center transition-colors disabled:opacity-0 disabled:pointer-events-none group border-l border-transparent hover:border-[#f0e6d2]"
                            disabled={currentPageIndex >= pages.length - 1}
                            aria-label="Next Page"
                        >
                            <span className="text-2xl text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors opacity-50 group-hover:opacity-100">
                                ›
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
