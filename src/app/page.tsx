"use client";

import Link from "next/link";
import { mockBooks, getLocalizedBook } from "@/lib/mockData";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>{t.home.welcome}</h1>
        <p>{t.home.subtitle}</p>
      </header>

      <div className={styles.grid}>
        {mockBooks.map((book) => {
          const localizedBook = getLocalizedBook(book, language);
          return (
            <Link key={book.id} href={`/books/${book.id}`} className={styles.card}>
              <div className={styles.coverWrapper}>
                <img src={localizedBook.coverUrl} alt={localizedBook.title} className={styles.cover} />
                <div className={styles.likeBadge}>
                  ❤️ {localizedBook.likes}
                </div>
              </div>
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
