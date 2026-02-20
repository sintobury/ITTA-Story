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

export function formatDate(dateString: string): string {
    if (!dateString) return '';

    // UTC 시간을 한국 시간(KST)으로 변환하여 포맷팅
    // 형식: YYYY.MM.DD HH:mm
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24시간제
        timeZone: 'Asia/Seoul'
    }).format(date).replace(/\. /g, '.').replace(/\.$/, ''); // "2023. 12. 31." -> "2023.12.31" 등 미세 조정이 필요할 수 있음
}
