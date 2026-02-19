import { Book, Page, Comment } from '@/types';

// 다국어 컨텐츠를 가져오는 헬퍼 함수
export function getLocalizedBook(book: Book, lang: string) {
    if (lang === 'en') return book;
    const translation = book.translations?.[lang];
    return {
        ...book,
        title: translation?.title || book.title,
        author: translation?.author || book.author,
        description: translation?.description || book.description,
    };
}

// 페이지 컨텐츠를 언어에 맞게 가져오는 함수
export function getLocalizedPage(page: Page, lang: string) {
    // 1. contentByLang 확인
    if (page.contentByLang && page.contentByLang[lang]) {
        return {
            ...page,
            content: page.contentByLang[lang]
        };
    }

    // 2. 기존 데이터 확인 (하위 호환)
    if (lang !== 'en' && page.translations?.[lang]?.content) {
        return {
            ...page,
            content: page.translations[lang].content
        };
    }

    // 3. 기본 컨텐츠 (영어)
    return page;
}

export function getLocalizedComment(comment: Comment, lang: string) {
    if (lang === 'en') return comment;
    const translation = comment.translations?.[lang];
    return {
        ...comment,
        content: translation?.content || comment.content,
    };
}
