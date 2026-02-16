/**
 * [BookForm.tsx]
 * 책을 새로 등록하거나(Create), 기존 책 정보를 수정(Edit)할 때 공통으로 사용하는 입력 폼 컴포넌트입니다.
 * - [Refactor] CSS Break-out 적용: 부모 컨테이너(max-w-1200px)를 무시하고 전체 너비 사용 (w-[99vw] + negative margins)
 */
"use client";

import { useState, useEffect } from "react";
import { Book, Page } from "@/types";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/common/RichTextEditor";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { Button } from "@/components/common/Button";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface BookFormProps {
    initialBook?: Book;
    initialPages?: Page[];
    mode: "create" | "edit";
}

const DEFAULT_LANGUAGES = [
    { code: 'ko', label: '한국어 (Korean)' },
    { code: 'en', label: '영어 (English)' },
    { code: 'ja', label: '일본어 (Japanese)' },
    { code: 'zh', label: '중국어 (Chinese)' },
];

export default function BookForm({ initialBook, initialPages, mode }: BookFormProps) {
    const router = useRouter();
    const { toastMessage, isToastExiting, triggerToast } = useToast();

    const getInitialValue = (obj: any, field: string) => {
        if (!obj) return "";
        return obj[field] || "";
    };

    // --- State ---
    const [title, setTitle] = useState(initialBook ? getInitialValue(initialBook, 'title') : "");
    const [author, setAuthor] = useState(initialBook ? getInitialValue(initialBook, 'author') : "");
    const [description, setDescription] = useState(initialBook ? getInitialValue(initialBook, 'description') : "");
    const [coverUrl, setCoverUrl] = useState(initialBook?.coverUrl || "");

    const [availableLanguages, setAvailableLanguages] = useState<string[]>(
        initialBook?.availableLanguages || ['ko', 'en', 'ja', 'zh']
    );
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        initialBook?.availableLanguages || ['ko']
    );
    const [customLangInput, setCustomLangInput] = useState("");

    const [pages, setPages] = useState<{ contentByLang: Record<string, string>; imageUrl: string }[]>(
        initialPages
            ? initialPages.map(p => ({
                contentByLang: p.contentByLang || (p.translations ?
                    Object.keys(p.translations).reduce((acc, lang) => ({ ...acc, [lang]: p.translations![lang].content || "" }), { en: p.content })
                    : { en: p.content }),
                imageUrl: p.imageUrl || ""
            }))
            : [{ contentByLang: { ko: "" }, imageUrl: "" }]
    );

    const [activeTabs, setActiveTabs] = useState<Record<number, string>>({});

    useEffect(() => {
        const initialTabs: Record<number, string> = {};
        pages.forEach((_, idx) => {
            if (!activeTabs[idx] && selectedLanguages.length > 0) {
                initialTabs[idx] = selectedLanguages[0];
            }
        });
        if (Object.keys(initialTabs).length > 0) {
            setActiveTabs(prev => ({ ...prev, ...initialTabs }));
        }
    }, [pages.length, selectedLanguages]);


    // --- Handlers ---
    const uploadImage = async (file: File, bucket: 'covers' | 'pages'): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                console.error(`Error uploading to ${bucket}:`, uploadError);
                triggerToast("이미지 업로드 실패");
                return null;
            }

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error("Upload exception:", error);
            triggerToast("이미지 업로드 중 오류 발생");
            return null;
        }
    };

    const toggleLanguage = (langCode: string) => {
        setSelectedLanguages(prev => {
            if (prev.includes(langCode)) {
                if (prev.length === 1) {
                    triggerToast("최소 한 개의 언어는 선택해야 합니다.");
                    return prev;
                }
                return prev.filter(c => c !== langCode);
            } else {
                return [...prev, langCode];
            }
        });
    };

    const addCustomLanguage = () => {
        if (!customLangInput.trim()) return;
        const newLang = customLangInput.trim().toLowerCase();
        if (availableLanguages.includes(newLang)) {
            triggerToast("이미 존재하는 언어입니다.");
            return;
        }
        setAvailableLanguages(prev => [...prev, newLang]);
        setSelectedLanguages(prev => [...prev, newLang]);
        setCustomLangInput("");
    };

    const removeCustomLanguage = (langCode: string) => {
        setAvailableLanguages(prev => prev.filter(l => l !== langCode));
        setSelectedLanguages(prev => prev.filter(l => l !== langCode));
    };

    const handleContentChange = (index: number, lang: string, value: string) => {
        const newPages = [...pages];
        newPages[index] = {
            ...newPages[index],
            contentByLang: {
                ...newPages[index].contentByLang,
                [lang]: value
            }
        };
        setPages(newPages);
    };

    const handleImageChange = (index: number, url: string) => {
        const newPages = [...pages];
        newPages[index] = { ...newPages[index], imageUrl: url };
        setPages(newPages);
    };

    const addPage = () => {
        setPages([...pages, { contentByLang: {}, imageUrl: "" }]);
    };

    const removePage = (index: number) => {
        setPages(pages.filter((_, i) => i !== index));
    };

    const handleTabChange = (index: number, lang: string) => {
        setActiveTabs(prev => ({ ...prev, [index]: lang }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, bucket: 'covers' | 'pages') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Show preview immediately? Or wait for upload? 
            // Let's show loading or just wait. For now, waiting is safer for URL consistency.
            // A spinner would be nice, but simple toast for now.
            triggerToast("이미지 업로드 중...");
            const publicUrl = await uploadImage(file, bucket);
            if (publicUrl) {
                setter(publicUrl);
                triggerToast("이미지 업로드 완료");
            }
        }
    };

    // --- Validation ---
    // Helper: HTML 태그 제거 후 텍스트만 추출
    const stripHtml = (html: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || "").trim();
    };

    const validateForm = (): boolean => {
        if (!title.trim() || !author.trim() || !description.trim()) {
            triggerToast("책 기본 정보를 모두 입력해주세요.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];

            // 모든 언어의 내용이 비어있는지 확인 (이미지만 있는 페이지 허용)
            // 로직: 하나라도 텍스트가 있다면, 선택된 모든 언어의 텍스트가 있어야 함. (번역 누락 방지)
            // 단, 아예 모든 언어의 텍스트가 없다면(이미지 전용 등) 통과.

            const contentStates = selectedLanguages.map(lang => {
                const val = page.contentByLang[lang] || "";
                return { lang, hasText: stripHtml(val) !== "" };
            });

            const allEmpty = contentStates.every(c => !c.hasText);
            const someEmpty = contentStates.some(c => !c.hasText);

            if (allEmpty) {
                // 모든 텍스트가 비어있으면 통과 (이미지 페이지로 간주)
                continue;
            }

            if (someEmpty) {
                // 텍스트가 일부만 있는 경우 -> 번역 누락으로 판단
                const missingLang = contentStates.find(c => !c.hasText)?.lang;
                if (missingLang) {
                    const defaultLabel = DEFAULT_LANGUAGES.find(l => l.code === missingLang)?.label.split(' ')[0];
                    const missingLangLabel = defaultLabel || missingLang;

                    triggerToast(`${i + 1}페이지의 [${missingLangLabel}] 내용을 입력해주세요.`);
                    const element = document.getElementById(`page-${i}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        handleTabChange(i, missingLang); // 해당 탭으로 전환
                    }
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            triggerToast(mode === "create" ? "책을 등록하는 중입니다..." : "책 정보를 수정하는 중입니다...");

            const bookData = {
                title,
                author,
                description,
                cover_url: coverUrl,
                available_languages: selectedLanguages,
                // translations could be added here if we had a UI for it
            };

            let bookId = initialBook?.id;

            if (mode === "create") {
                // 1. Insert Book
                const { data, error } = await supabase
                    .from('books')
                    .insert(bookData)
                    .select()
                    .single();

                if (error) throw error;
                bookId = data.id;
            } else {
                // 1. Update Book
                const { error } = await supabase
                    .from('books')
                    .update(bookData)
                    .eq('id', bookId);

                if (error) throw error;

                // 2. Delete existing pages (Strategy: Delete All & Re-insert)
                const { error: deleteError } = await supabase
                    .from('pages')
                    .delete()
                    .eq('book_id', bookId);

                if (deleteError) throw deleteError;
            }

            if (!bookId) throw new Error("Book ID is missing");

            // 3. Prepare Pages Data
            const pagesData = pages.map((p, index) => ({
                book_id: bookId,
                page_number: index + 1,
                image_url: p.imageUrl || null, // null if empty
                content_by_lang: p.contentByLang,
            }));

            console.log("Pages Data Payload:", pagesData);

            // 4. Insert Pages
            if (pagesData.length > 0) {
                const { error: pagesError } = await supabase
                    .from('pages')
                    .insert(pagesData);

                if (pagesError) throw pagesError;
            }

            triggerToast(mode === "create" ? "책이 성공적으로 등록되었습니다!" : "책 정보가 수정되었습니다!");

            // Redirect after a short delay to allow toast to be seen
            setTimeout(() => {
                router.push("/admin");
                router.refresh(); // Refresh to show new data
            }, 1000);

        } catch (error: any) {
            console.error("Error saving book:", error);
            console.error("Error details:", error.details, error.hint, error.message);
            triggerToast(`오류 발생: ${error.message || "알 수 없는 오류"}`);
        }
    };

    // [CSS Break-out]
    // 부모 컨테이너(.container, max-w-1200px)를 벗어나 전체 화면 너비(99vw)를 사용하기 위한 스타일
    // ml-[calc(-50vw+50%)] -> 화면 중앙 기준 왼쪽 끝으로 이동
    const breakOutStyle = {
        width: "99vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-5 mx-auto py-5 pb-32 px-2 relative"
            style={breakOutStyle}
        >

            {/* 왼쪽 메인 컨텐츠 영역 (책 정보 + 페이지 에디터) */}
            <div className="flex-1 flex flex-col gap-5 min-w-0 pl-4"> {/* pl-4 추가로 좌측 여백 확보 */}
                {/* 1. 책 정보 섹션 (Compact Style) */}
                <section className="bg-[var(--card-bg)] p-5 rounded-xl shadow-[var(--card-shadow)] border border-[var(--border)] transition-all hover:shadow-md">
                    <div className="flex gap-5 max-md:flex-col">
                        {/* 표지 이미지 (작게) */}
                        {/* 표지 이미지 (작게) - Flex Column으로 높이 동기화 */}
                        <div className="w-[140px] flex-shrink-0 max-md:w-full flex flex-col">
                            {/* 오른쪽 헤더(28px + mb-2)와 높이를 맞추기 위한 Spacer + Label */}
                            <div className="flex-none h-[36px] flex items-end pb-1"> {/* 1.75rem(h3) + 0.5rem(mb-2) approx 36px? Or just match structure */}
                                <label className="block font-medium text-[var(--secondary)] text-xs">표지</label>
                            </div>

                            <div className="flex-1 w-full border border-dashed border-[var(--border)] rounded-lg bg-[var(--background)] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[var(--primary)] transition-all cursor-pointer shadow-sm min-h-[200px]">
                                {!coverUrl ? (
                                    <>
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setCoverUrl, 'covers')} id="cover-upload" className="hidden" />
                                        <label htmlFor="cover-upload" className="absolute inset-0 flex flex-col items-center justify-center text-[var(--secondary)] cursor-pointer group-hover:text-[var(--primary)] transition-colors">
                                            <span className="text-2xl opacity-50">📷</span>
                                        </label>
                                    </>
                                ) : (
                                    <div className="relative w-full h-full group/preview">
                                        <Image
                                            src={coverUrl}
                                            alt="Cover preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <Button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setCoverUrl(""); }}
                                            size="sm"
                                            variant="danger"
                                            className="absolute top-1 right-1 rounded-full w-5 h-5 min-h-0 p-0 text-xs flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-sm"
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 텍스트 정보 (Flex Layout for Dynamic Height) */}
                        <div className="flex-1 flex flex-col gap-4 min-w-0">
                            <div className="flex-none">
                                <h3 className="text-[var(--primary)] text-lg font-bold flex items-center gap-2 mb-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs">1</span>
                                    책 기본 정보
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-none">
                                <div>
                                    <label className="block mb-1 font-medium text-[var(--foreground)] text-sm">제목 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="책 제목"
                                        className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] focus:border-[var(--primary)] outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium text-[var(--foreground)] text-sm">저자 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={e => setAuthor(e.target.value)}
                                        placeholder="저자명"
                                        className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] focus:border-[var(--primary)] outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col min-h-[100px]">
                                <label className="block mb-1 font-medium text-[var(--foreground)] text-sm">설명 <span className="text-red-500">*</span></label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="책 설명"
                                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] focus:border-[var(--primary)] outline-none transition-all resize-none shadow-sm flex-1 h-full min-h-[80px]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. 페이지 내용 섹션 */}
                <section className="bg-[var(--card-bg)] p-5 rounded-xl shadow-[var(--card-shadow)] border border-[var(--border)] transition-all hover:shadow-md flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--border)]">
                        <h3 className="text-[var(--primary)] text-lg font-bold flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs">2</span>
                            페이지 내용 편집
                        </h3>
                        <span className="text-xs px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--secondary)] font-medium">
                            총: {pages.length} 페이지
                        </span>
                    </div>

                    <div className="space-y-8">
                        {pages.map((page, index) => {
                            const currentTab = activeTabs[index] || selectedLanguages[0] || 'ko';

                            return (
                                <div id={`page-${index}`} key={index} className="relative group/page scroll-mt-28">
                                    {index > 0 && <div className="border-t border-dashed border-[var(--border)] my-8" />}

                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <h4 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                                            <span className="text-[var(--primary)]">#{index + 1}</span>
                                            페이지
                                        </h4>
                                        {pages.length > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() => removePage(index)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-[#e74c3c] hover:bg-red-50 hover:text-[#c0392b] px-2 py-1 h-auto rounded transition-colors font-medium opacity-0 group-hover/page:opacity-100 border border-transparent hover:border-red-200"
                                            >
                                                삭제
                                            </Button>
                                        )}
                                    </div>

                                    <div className="bg-[var(--background)] rounded-lg border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row h-[550px] max-md:h-auto">
                                            {/* 왼쪽: 이미지 (30%) */}
                                            <div className="w-full md:w-[30%] border-r border-[var(--border)] bg-gray-50/50 dark:bg-black/20 p-4 flex flex-col relative">
                                                <div className="flex-1 border border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-white dark:bg-[#1e1e1e] hover:border-[var(--primary)] transition-all group/image cursor-pointer shadow-inner">
                                                    {!page.imageUrl ? (
                                                        <>
                                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => handleImageChange(index, url), 'pages')} id={`page-img-${index}`} className="hidden" />
                                                            <label htmlFor={`page-img-${index}`} className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center text-[var(--secondary)] group-hover/image:text-[var(--primary)] transition-colors">
                                                                <span className="text-3xl mb-2 opacity-40 group-hover/image:opacity-80 transition-opacity">📷</span>
                                                                <span className="text-xs">이미지 업로드</span>
                                                            </label>
                                                        </>
                                                    ) : (
                                                        <div className="relative w-full h-full group/preview">
                                                            <Image
                                                                src={page.imageUrl}
                                                                alt={`Page ${index + 1}`}
                                                                fill
                                                                className="object-contain p-2"
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => handleImageChange(index, "")}
                                                                size="sm"
                                                                variant="danger"
                                                                className="absolute top-2 right-2 rounded-full w-6 h-6 min-h-0 p-0 text-xs flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-md"
                                                            >
                                                                ✕
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 오른쪽: 텍스트 에디터 (70%) */}
                                            <div className="w-full md:w-[70%] flex flex-col bg-white dark:bg-[#121212]">
                                                <div className="flex justify-start px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
                                                    <div className="flex p-1 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-sm overflow-x-auto scroller-hide max-w-full">
                                                        {selectedLanguages.map(lang => (
                                                            <Button
                                                                key={lang}
                                                                type="button"
                                                                onClick={() => handleTabChange(index, lang)}
                                                                variant={currentTab === lang ? 'primary' : 'ghost'}
                                                                className={`min-w-[70px] px-3 py-1.5 text-xs font-medium rounded-lg h-auto transition-all whitespace-nowrap ${currentTab === lang
                                                                    ? 'shadow-sm font-bold'
                                                                    : 'hover:bg-[var(--background)]'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-center gap-1.5">
                                                                    <span>{DEFAULT_LANGUAGES.find(l => l.code === lang)?.label.split(' ')[0] || lang.toUpperCase()}</span>
                                                                    {stripHtml(page.contentByLang[lang] || "") !== "" && (
                                                                        <span className={`w-1.5 h-1.5 rounded-full shadow-sm block ${currentTab === lang ? 'bg-white' : 'bg-green-500'}`} />
                                                                    )}
                                                                </div>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Editor Wrapper with Padding and Full Height */}
                                                <div className="flex-1 flex flex-col relative p-1 bg-white dark:bg-[#121212] overflow-hidden">
                                                    <div className="flex-1 h-full transition-all">
                                                        <RichTextEditor
                                                            key={currentTab}
                                                            value={page.contentByLang[currentTab] || ""}
                                                            onChange={(val) => handleContentChange(index, currentTab, val)}
                                                            placeholder={`${DEFAULT_LANGUAGES.find(l => l.code === currentTab)?.label || currentTab} 내용 입력`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Button
                        type="button"
                        onClick={addPage}
                        variant="ghost"
                        className="w-full mt-8 py-4 h-auto border border-dashed border-[var(--border)] rounded-xl text-[var(--secondary)] font-bold text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
                    >
                        <span className="w-5 h-5 rounded-full bg-[var(--border)] text-white flex items-center justify-center group-hover:bg-[var(--primary)] transition-colors text-sm">+</span>
                        페이지 추가
                    </Button>
                </section>
            </div>

            {/* 오른쪽 사이드바 (Sticky) - Compact */}
            <div className="w-full lg:w-[220px] lg:flex-shrink-0 pr-4"> {/* pr-4 추가로 우측 여백 확보 */}
                <div className="sticky top-20 flex flex-col gap-4">
                    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
                        <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 pb-2 border-b border-[var(--border)]">
                            {mode === "create" ? "업로드" : "수정"}
                        </h2>

                        <div className="flex flex-col gap-2 mb-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full text-sm font-bold shadow-md hover:brightness-110 hover:-translate-y-0.5 transition-all active:translate-y-0"
                            >
                                {mode === "create" ? "✨ 업로드" : "💾 저장"}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => router.back()}
                                variant="secondary"
                                className="w-full text-sm font-medium hover:text-[var(--foreground)] transition-colors"
                            >
                                취소
                            </Button>
                        </div>

                        <div className="pt-2">
                            <h4 className="font-bold text-[var(--foreground)] mb-2 text-xs uppercase tracking-wide opacity-80">Languages</h4>
                            <div className="flex flex-col gap-1.5 mb-3">
                                {availableLanguages.map(lang => (
                                    <label key={lang} className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all select-none ${selectedLanguages.includes(lang) ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-[var(--background)] border-[var(--border)] hover:border-[var(--primary)]'}`}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selectedLanguages.includes(lang) ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 dark:bg-black dark:border-gray-600'}`}>
                                                {selectedLanguages.includes(lang) && <span className="text-white text-[10px]">✓</span>}
                                            </div>
                                            <span className={`text-xs font-medium ${selectedLanguages.includes(lang) ? 'text-blue-700 dark:text-blue-300' : 'text-[var(--secondary)]'}`}>
                                                {DEFAULT_LANGUAGES.find(l => l.code === lang)?.label.split(' ')[0] || lang.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!DEFAULT_LANGUAGES.some(l => l.code === lang) && (
                                                <Button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removeCustomLanguage(lang);
                                                    }}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-5 h-5 p-0 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                    title="언어 삭제"
                                                >
                                                    <span className="text-xs">✕</span>
                                                </Button>
                                            )}
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedLanguages.includes(lang)}
                                                onChange={() => toggleLanguage(lang)}
                                            />
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    value={customLangInput}
                                    onChange={e => setCustomLangInput(e.target.value)}
                                    placeholder="+ Lang"
                                    className="flex-1 w-full px-2 py-1.5 text-xs border border-[var(--border)] rounded bg-[var(--background)] focus:outline-none focus:border-[var(--primary)]"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomLanguage())}
                                />
                                <Button
                                    type="button"
                                    onClick={addCustomLanguage}
                                    variant="secondary"
                                    size="sm"
                                    className="px-2 py-1.5 h-auto rounded text-xs hover:opacity-90 transition-opacity"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast 메시지 렌더링 */}
            <Toast message={toastMessage} isExiting={isToastExiting} />
        </form>
    );
}
