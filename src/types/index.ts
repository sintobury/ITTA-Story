export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    coverUrl: string;
    likes: number;
    views: number; // 조회수
    availableLanguages: string[]; // 제공되는 언어 목록 (예: ['ko', 'en', 'fr'])
    createdAt?: string; // 생성일 (Supabase 연동용)
    translations?: {
        [key: string]: { // 언어 코드를 키로 사용 (확장 가능)
            title?: string;
            author?: string;
            description?: string;
        };
    };
}

export interface Page {
    pageNumber: number;
    content?: string; // 기본 컨텐츠 (보통 한국어 또는 대표 언어, 레거시 지원용)
    imageUrl?: string;
    // 언어별 컨텐츠 저장 (contentByLang으로 명확히 구분)
    contentByLang?: {
        [key: string]: string; // 예: { 'ko': '안녕', 'en': 'Hello' }
    };
    // 하위 호환성을 위해 유지하되, 새로운 로직은 contentByLang 사용 권장
    translations?: {
        [key: string]: {
            content?: string;
        };
    };
}

export interface Comment {
    id: string;
    bookId: string;
    userId: string; // 차단을 위해 추가
    userName: string;
    content: string;
    createdAt: string;
    translations?: {
        [key: string]: {
            content?: string;
        };
    };
}

export interface ReadingHistory {
    bookId: string;
    lastPage: number;
    lastReadAt: string;
    completed: boolean;
}
