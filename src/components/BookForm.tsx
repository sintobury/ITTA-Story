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
import styles from "./BookForm.module.css";
import { useRouter } from "next/navigation";

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
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* 헤더: 제목만 표시 */}
            <div className={styles.header}>
                <h2>{mode === "create" ? "새 책 업로드" : "책 수정"}</h2>
            </div>

            {/* 섹션 1: 책 기본 정보 입력 */}
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

                {/* 표지 이미지 업로드 UI */}
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

            {/* 섹션 2: 페이지 내용 입력 (동적으로 추가/삭제 가능) */}
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

            {/* 하단 우측 고정 액션 버튼 (취소 / 저장) */}
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
