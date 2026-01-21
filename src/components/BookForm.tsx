"use client";

import { useState } from "react";
import { Book, Page } from "@/lib/mockData";
import styles from "./BookForm.module.css";
import { useRouter } from "next/navigation";

interface BookFormProps {
    initialBook?: Book;
    initialPages?: Page[];
    mode: "create" | "edit";
}

export default function BookForm({ initialBook, initialPages, mode }: BookFormProps) {
    const router = useRouter();

    // Helpers
    const getInitialValue = (obj: any, field: string) => {
        if (!obj) return "";
        // Always use the original data, do not localize for editing
        return obj[field] || "";
    };

    const [title, setTitle] = useState(initialBook ? getInitialValue(initialBook, 'title') : "");
    const [author, setAuthor] = useState(initialBook ? getInitialValue(initialBook, 'author') : "");
    const [description, setDescription] = useState(initialBook ? getInitialValue(initialBook, 'description') : "");
    const [coverUrl, setCoverUrl] = useState(initialBook?.coverUrl || "");

    const [pages, setPages] = useState<{ content: string; imageUrl: string }[]>(
        initialPages
            ? initialPages.map(p => ({
                content: getInitialValue(p, 'content'),
                imageUrl: p.imageUrl || ""
            }))
            : [{ content: "", imageUrl: "" }]
    );

    const handlePageChange = (index: number, field: "content" | "imageUrl", value: string) => {
        const newPages = [...pages];
        newPages[index] = { ...newPages[index], [field]: value };
        setPages(newPages);
    };

    const addPage = () => {
        setPages([...pages, { content: "", imageUrl: "" }]);
    };

    const removePage = (index: number) => {
        const newPages = pages.filter((_, i) => i !== index);
        setPages(newPages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ title, author, description, coverUrl, pages });
        alert(mode === "create" ? "책이 성공적으로 발행되었습니다!" : "책 정보가 수정되었습니다!");
        router.push("/admin");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setter(url);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Header: Title Only */}
            <div className={styles.header}>
                <h2>{mode === "create" ? "새 책 업로드" : "책 수정"}</h2>
            </div>

            <section className={styles.section}>
                <h3>1. 책 정보</h3>

                <div className={styles.formGroup}>
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="예: 어린 왕자"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>저자</label>
                    <input
                        type="text"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        placeholder="예: 앙투안 드 생텍쥐페리"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>설명</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>표지 이미지</label>
                    <div className={styles.imageUpload}>
                        {!coverUrl ? (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setCoverUrl)}
                                    id="cover-upload"
                                    className={styles.hiddenInput}
                                />
                                <label htmlFor="cover-upload" className={styles.uploadLabel}>
                                    🖼️ 이미지 선택
                                </label>
                                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>또는 파일을 여기로 드래그하세요</span>
                            </>
                        ) : (
                            <div className={styles.preview}>
                                <img src={coverUrl} alt="Cover preview" />
                                <button type="button" onClick={() => setCoverUrl("")} className={styles.removeImageBtn}>
                                    🗑️ 이미지 삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h3>2. 페이지 내용</h3>

                {pages.map((page, index) => (
                    <div key={index} className={styles.pageCard}>
                        <div className={styles.pageHeader}>
                            <h4>페이지 {index + 1}</h4>
                            {pages.length > 1 && (
                                <button type="button" onClick={() => removePage(index)} className={styles.removeBtn}>
                                    페이지 삭제
                                </button>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>텍스트 내용</label>
                            <textarea
                                value={page.content}
                                onChange={(e) => handlePageChange(index, "content", e.target.value)}
                                rows={6}
                                placeholder="이 페이지의 내용을 입력하세요..."
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>삽화 (선택사항)</label>
                            <div className={styles.imageUpload}>
                                {!page.imageUrl ? (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, (url) => handlePageChange(index, "imageUrl", url))}
                                            id={`page-upload-${index}`}
                                            className={styles.hiddenInput}
                                        />
                                        <label htmlFor={`page-upload-${index}`} className={styles.uploadLabel}>
                                            🖼️ 이미지 선택
                                        </label>
                                    </>
                                ) : (
                                    <div className={styles.preview}>
                                        <img src={page.imageUrl} alt="Page preview" />
                                        <button
                                            type="button"
                                            onClick={() => handlePageChange(index, "imageUrl", "")}
                                            className={styles.removeImageBtn}
                                        >
                                            🗑️ 이미지 삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <button type="button" onClick={addPage} className={styles.addPageBtn}>
                    + 페이지 추가
                </button>
            </section>

            {/* Floating Actions Bottom Right */}
            <div className={styles.floatingActions}>
                <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
                    취소
                </button>
                <button type="submit" className={styles.submitBtn}>
                    {mode === "create" ? "책 발행하기" : "변경사항 저장"}
                </button>
            </div>
        </form>
    );
}
