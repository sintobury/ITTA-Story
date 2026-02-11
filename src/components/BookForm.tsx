/**
 * [BookForm.tsx]
 * 책을 새로 등록하거나(Create), 기존 책 정보를 수정(Edit)할 때 공통으로 사용하는 입력 폼 컴포넌트입니다.
 * - 책 기본 정보(제목, 저자, 설명, 표지) 입력
 * - 페이지별 내용(텍스트, 삽화) 동적 추가/삭제
 * - 이미지 업로드 미리보기 기능 포함
 */
"use client";

import { useState } from "react";
import { Book, Page } from "@/lib/mockData";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/common/RichTextEditor";

interface BookFormProps {
    initialBook?: Book;     // 수정 시 초기 책 데이터
    initialPages?: Page[];  // 수정 시 초기 페이지 데이터
    mode: "create" | "edit"; // 생성 모드인지 수정 모드인지 구분
}

export default function BookForm({ initialBook, initialPages, mode }: BookFormProps) {
    const router = useRouter();

    // 헬퍼 함수: 객체에서 특정 필드 값을 안전하게 가져옴
    const getInitialValue = (obj: any, field: string) => {
        if (!obj) return "";
        // 수정 모드일 때 번역된 데이터가 아닌 원본 데이터를 가져옴
        return obj[field] || "";
    };

    // --- 상태 관리 (State Management) ---
    // 책 기본 정보 상태
    const [title, setTitle] = useState(initialBook ? getInitialValue(initialBook, 'title') : "");
    const [author, setAuthor] = useState(initialBook ? getInitialValue(initialBook, 'author') : "");
    const [description, setDescription] = useState(initialBook ? getInitialValue(initialBook, 'description') : "");
    const [coverUrl, setCoverUrl] = useState(initialBook?.coverUrl || "");

    // 페이지 리스트 상태 (내용 + 이미지 URL)
    const [pages, setPages] = useState<{ content: string; imageUrl: string }[]>(
        initialPages
            ? initialPages.map(p => ({
                content: getInitialValue(p, 'content'),
                imageUrl: p.imageUrl || ""
            }))
            : [{ content: "", imageUrl: "" }] // 기본적으로 1개의 빈 페이지 생성
    );

    // 페이지 내용 변경 핸들러
    const handlePageChange = (index: number, field: "content" | "imageUrl", value: string) => {
        const newPages = [...pages];
        newPages[index] = { ...newPages[index], [field]: value };
        setPages(newPages);
    };

    // 새 페이지 추가
    const addPage = () => {
        setPages([...pages, { content: "", imageUrl: "" }]);
    };

    // 페이지 삭제
    const removePage = (index: number) => {
        const newPages = pages.filter((_, i) => i !== index);
        setPages(newPages);
    };

    // 폼 제출 핸들러 (저장/발행)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // [클라 확인용] 실제로는 여기서 API를 호출하여 데이터를 서버에 전송해야 함 (로그 출력으로 대체)
        console.log({ title, author, description, coverUrl, pages });

        alert(mode === "create" ? "책이 성공적으로 발행되었습니다!" : "책 정보가 수정되었습니다!");
        router.push("/admin"); // 저장 후 관리자 페이지로 이동
    };

    // 이미지 업로드 핸들러 (브라우저에서 미리보기 URL 생성)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            // [클라 확인용] 브라우저 Blob URL 사용 (서버 업로드 X)
            setter(url);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-[800px] mx-auto py-8 pb-24">
            {/* 헤더: 제목만 표시 */}
            <div className="mb-4 pb-4 border-b border-[var(--border)]">
                <h2 className="text-[1.8rem] text-[var(--foreground)] m-0">{mode === "create" ? "새 책 업로드" : "책 수정"}</h2>
            </div>

            {/* 섹션 1: 책 기본 정보 입력 */}
            <section className="bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)]">
                <h3 className="mb-6 pb-2 border-b border-[var(--border)] text-[var(--primary)] text-lg font-bold">1. 책 정보</h3>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-[var(--secondary)]">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="예: 어린 왕자"
                        required
                        className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] text-base transition-colors focus:outline-none focus:border-[var(--primary)]"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-[var(--secondary)]">저자</label>
                    <input
                        type="text"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        placeholder="예: 앙투안 드 생텍쥐페리"
                        required
                        className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] text-base transition-colors focus:outline-none focus:border-[var(--primary)]"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-[var(--secondary)]">설명</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        required
                        className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] text-base transition-colors focus:outline-none focus:border-[var(--primary)]"
                    />
                </div>

                {/* 표지 이미지 업로드 UI */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-[var(--secondary)]">표지 이미지</label>
                    <div className="border-2 dashed border-[var(--border)] p-10 rounded-xl text-center transition-all bg-[var(--background)] flex flex-col items-center justify-center gap-4 hover:border-[var(--primary)] hover:bg-[#3498db08] group">
                        {!coverUrl ? (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setCoverUrl)}
                                    id="cover-upload"
                                    className="hidden"
                                />
                                <label htmlFor="cover-upload" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[var(--border)] rounded-lg cursor-pointer font-medium text-[var(--foreground)] shadow-sm transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:-translate-y-px hover:shadow-md">
                                    🖼️ 이미지 선택
                                </label>
                                <span className="text-sm text-[var(--secondary)]">또는 파일을 여기로 드래그하세요</span>
                            </>
                        ) : (
                            <div className="mt-2 w-full flex flex-col items-center gap-4">
                                <img src={coverUrl} alt="Cover preview" className="max-w-full max-h-[400px] rounded-lg shadow-md object-contain" />
                                <button type="button" onClick={() => setCoverUrl("")} className="px-4 py-2 bg-[#fee2e2] text-[#dc2626] border-0 rounded-md text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 hover:bg-[#fecaca] hover:-translate-y-px">
                                    🗑️ 이미지 삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 섹션 2: 페이지 내용 입력 (동적으로 추가/삭제 가능) */}
            <section className="bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)]">
                <h3 className="mb-6 pb-2 border-b border-[var(--border)] text-[var(--primary)] text-lg font-bold">2. 페이지 내용</h3>

                {pages.map((page, index) => (
                    <div key={index} className="bg-[var(--background)] p-6 rounded-lg border border-[var(--border)] mb-8 relative">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-dashed border-[var(--border)]">
                            <h4 className="text-[1.1rem] text-[var(--foreground)] font-semibold">페이지 {index + 1}</h4>
                            {pages.length > 1 && (
                                <button type="button" onClick={() => removePage(index)} className="bg-[#ffebee] text-[#c62828] border-0 px-3 py-1.5 rounded-md cursor-pointer text-sm font-semibold transition-all flex items-center gap-1.5 hover:bg-[#FFCDD2]">
                                    페이지 삭제
                                </button>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 font-medium text-[var(--secondary)]">텍스트 내용</label>
                            <RichTextEditor
                                value={page.content}
                                onChange={(val) => handlePageChange(index, "content", val)}
                                placeholder="이 페이지의 내용을 입력하세요... (스타일 적용 가능)"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 font-medium text-[var(--secondary)]">삽화 (선택사항)</label>
                            <div className="border-2 dashed border-[var(--border)] p-10 rounded-xl text-center transition-all bg-[var(--background)] flex flex-col items-center justify-center gap-4 hover:border-[var(--primary)] hover:bg-[#3498db08]">
                                {!page.imageUrl ? (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, (url) => handlePageChange(index, "imageUrl", url))}
                                            id={`page-upload-${index}`}
                                            className="hidden"
                                        />
                                        <label htmlFor={`page-upload-${index}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[var(--border)] rounded-lg cursor-pointer font-medium text-[var(--foreground)] shadow-sm transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:-translate-y-px hover:shadow-md">
                                            🖼️ 이미지 선택
                                        </label>
                                    </>
                                ) : (
                                    <div className="mt-2 w-full flex flex-col items-center gap-4">
                                        <img src={page.imageUrl} alt="Page preview" className="max-w-full max-h-[400px] rounded-lg shadow-md object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => handlePageChange(index, "imageUrl", "")}
                                            className="px-4 py-2 bg-[#fee2e2] text-[#dc2626] border-0 rounded-md text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 hover:bg-[#fecaca] hover:-translate-y-px"
                                        >
                                            🗑️ 이미지 삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <button type="button" onClick={addPage} className="flex items-center justify-center w-full p-6 bg-[var(--background)] border-2 dashed border-[var(--border)] rounded-xl text-[var(--secondary)] font-semibold text-[1.1rem] cursor-pointer transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[#3498db08]">
                    + 페이지 추가
                </button>
            </section>

            {/* 하단 우측 고정 액션 버튼 (취소 / 저장) */}
            <div className="fixed bottom-8 right-8 flex gap-4 z-[1000] p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-black/5 dark:bg-[#1e1e1e]/80 dark:border-white/10">
                <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-full cursor-pointer font-semibold text-[var(--secondary)] transition-all shadow-sm hover:bg-[var(--card-bg)] hover:text-[var(--foreground)] hover:-translate-y-0.5 hover:shadow-md">
                    취소
                </button>
                <button type="submit" className="px-8 py-3 bg-[var(--primary)] text-white border-0 rounded-full text-base font-semibold cursor-pointer shadow-[0_4px_12px_rgba(52,152,219,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(52,152,219,0.5)]">
                    {mode === "create" ? "책 발행하기" : "변경사항 저장"}
                </button>
            </div>
        </form>
    );
}
