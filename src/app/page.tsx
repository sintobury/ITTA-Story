/**
 * [page.tsx] (Home)
 * 사이트의 메인 홈 페이지입니다.
 * - 등록된 모든 책을 그리드 형태로 보여줍니다.
 * - 각 책의 표지, 제목, 저자, 좋아요 수를 표시합니다.
 */
"use client";

import Link from "next/link";
import { mockBooks, getLocalizedBook } from "@/lib/mockData";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
// next/image를 사용하여 이미지 최적화 (실제 배포 시 권장)
// import Image from "next/image";

// 메인 함수: 클라이언트 컴포넌트로 데이터 페칭 및 렌더링 수행
export default function Home() {
  // 언어 설정 가져오기 (전역 상태)
  const { t, language } = useLanguage();

  // 실제 API 호출 대신 Mock Data 사용
  const books = mockBooks;

  return (
    <div className={styles.home}>
      {/* 헤더 섹션: 사이트 제목 및 소개 (언어 설정에 따라 텍스트 변경) */}
      <header className={styles.header}>
        <h1>{t.home.welcome}</h1>
        <p>{t.home.subtitle}</p>
      </header>

      {/* 책 리스트 그리드 섹션 */}
      <div className={styles.grid}>
        {books.map((book) => {
          // 현재 언어 설정에 맞춰 책 정보를 번역된 상태로 변환
          const localizedBook = getLocalizedBook(book, language);

          return (
            <Link href={`/books/${book.id}`} key={book.id} className={styles.card}>
              <div className={styles.coverWrapper}>
                <img src={localizedBook.coverUrl} alt={localizedBook.title} className={styles.cover} />

                {/* 좋아요 뱃지: 좋아요가 있을 경우에만 표시 */}
                {book.likes > 0 && (
                  <div className={styles.likeBadge}>
                    <span>❤️</span> {book.likes}
                  </div>
                )}
              </div>

              {/* 책 정보 섹션 */}
              <div className={styles.info}>
                <h2 className={styles.title}>{localizedBook.title}</h2>
                <p className={styles.author}>{localizedBook.author}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
