// 책 데이터 인터페이스 정의
export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    coverUrl: string;
    likes: number;
    availableLanguages: string[]; // 제공되는 언어 목록 (예: ['ko', 'en', 'fr'])
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
    content: string; // 기본 컨텐츠 (보통 한국어 또는 대표 언어)
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
    userName: string;
    content: string;
    createdAt: string;
    translations?: {
        [key: string]: {
            content?: string;
        };
    };
}

export const mockUserLikes: Record<string, string[]> = {
    "u1": ["1", "3"],
    "u2": ["2"],
};

export interface ReadingHistory {
    bookId: string;
    lastPage: number;
    lastReadAt: string;
    completed: boolean;
}

export const mockReadingHistory: Record<string, ReadingHistory[]> = {
    "u1": [
        { bookId: "1", lastPage: 3, lastReadAt: "2023-10-20T10:00:00", completed: false },
        { bookId: "2", lastPage: 1, lastReadAt: "2023-10-18T14:30:00", completed: false }
    ],
    "u2": []
};

const originalBooks: Book[] = [
    {
        id: "1",
        title: "The Little Prince",
        author: "Antoine de Saint-Exupéry",
        description: "A young prince visits various planets in space, including Earth, and addresses themes of loneliness, friendship, love, and loss.",
        coverUrl: "https://placehold.co/400x600/2c3e50/FFFFFF?text=The+Little+Prince",
        likes: 124,
        availableLanguages: ['en', 'ko'],
        translations: {
            ko: {
                title: "어린 왕자",
                author: "앙투안 드 생텍쥐페리",
                description: "사막에 불시착한 조종사가 어린 왕자를 만나 겪는 신비로운 이야기. 사랑과 우정, 그리고 상실에 대한 깊은 통찰을 담고 있습니다.",
            }
        }
    },
    {
        id: "2",
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction novel and cautionary tale about the future.",
        coverUrl: "https://placehold.co/400x600/8e44ad/FFFFFF?text=1984",
        likes: 89,
        availableLanguages: ['en', 'ko'],
        translations: {
            ko: {
                title: "1984",
                author: "조지 오웰",
                description: "미래의 전체주의 사회를 그린 디스토피아 소설. 감시와 통제, 진실의 왜곡을 경고합니다.",
            }
        }
    },
    {
        id: "3",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A 1925 novel set in the Jazz Age on Long Island, near New York City.",
        coverUrl: "https://placehold.co/400x600/27ae60/FFFFFF?text=Great+Gatsby",
        likes: 56,
        availableLanguages: ['en', 'ko'],
        translations: {
            ko: {
                title: "위대한 개츠비",
                author: "F. 스콧 피츠제럴드",
                description: "1920년대 재즈 시대를 배경으로 한 꿈과 사랑, 그리고 비극적인 욕망의 이야기.",
            }
        }
    },
    {
        id: "4",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description: "A romantic novel of manners written by Jane Austen in 1813.",
        coverUrl: "https://placehold.co/400x600/c0392b/FFFFFF?text=Pride+Prejudice",
        likes: 210,
        availableLanguages: ['en', 'ko'],
        translations: {
            ko: {
                title: "오만과 편견",
                author: "제인 오스틴",
                description: "19세기 영국 시골을 배경으로 한 사랑과 오해, 그리고 성장에 관한 로맨틱 코미디의 고전.",
            }
        }
    },
    {
        id: "5",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        description: "A children's fantasy novel following the quest of home-loving Bilbo Baggins.",
        coverUrl: "https://placehold.co/400x600/d35400/FFFFFF?text=The+Hobbit",
        likes: 150,
        availableLanguages: ['en', 'ko'],
        translations: {
            ko: {
                title: "호빗",
                author: "J.R.R. 톨킨",
                description: "집을 사랑하는 호빗 빌보 배긴스의 모험을 그린 판타지 소설.",
            }
        }
    },
    {
        id: "6",
        title: "The Lost City",
        author: "Indiana Jones",
        description: "A visual journey through the discovery of an ancient civilization.",
        coverUrl: "https://placehold.co/400x600/8B4513/FFFFFF?text=Lost+City",
        likes: 12,
        availableLanguages: ['en', 'ko'],
        translations: {
            ko: {
                title: "잃어버린 도시",
                author: "인디아나 존스",
                description: "고대 문명의 발견을 다룬 시각적 여정.",
            }
        }
    }
];

// 50개 이상의 더미 데이터를 생성하여 페이지네이션 테스트
const generateMoreBooks = (): Book[] => {
    const moreBooks: Book[] = [];
    const colors = ['2c3e50', '8e44ad', '27ae60', 'c0392b', 'd35400', '8B4513', '16a085', '2980b9'];

    for (let i = 7; i <= 56; i++) {
        const color = colors[i % colors.length];
        moreBooks.push({
            id: i.toString(),
            title: `Book Title ${i} `,
            author: `Author Number ${i} `,
            description: `This is a generated description for book number ${i}. It serves as a placeholder to test the layout and pagination features.`,
            coverUrl: `https://placehold.co/400x600/${color}/FFFFFF?text=Book+${i}`,
            likes: (i * 17) % 200, // Deterministic random-like value
            availableLanguages: ['en', 'ko'],
            translations: {
                ko: {
                    title: `책 제목 ${i}`,
                    author: `작가 번호 ${i}`,
                    description: `이것은 책 번호 ${i}에 대한 생성된 설명입니다. 레이아웃과 페이지네이션 기능을 테스트하기 위한 용도입니다.`
                }
            }
        });
    }
    return moreBooks;
};

export const mockBooks: Book[] = [...originalBooks, ...generateMoreBooks()];

export const mockPages: Record<string, Page[]> = {
    "1": [
        {
            pageNumber: 1,
            content: "Once when I was six years old I saw a magnificent picture in a book, called True Stories from Nature, about the primeval forest. It was a picture of a boa constrictor in the act of swallowing an animal.",
            imageUrl: "https://placehold.co/600x400/2c3e50/FFFFFF?text=Boa+Constrictor",
            contentByLang: {
                en: "Once when I was six years old I saw a magnificent picture in a book, called True Stories from Nature, about the primeval forest. It was a picture of a boa constrictor in the act of swallowing an animal.",
                ko: "내가 여섯 살 적에, 나는 '자연의 체험'이라는 제목의 책에서 원시림에 관한 훌륭한 그림 하나를 보았다. 그것은 맹수를 집어삼키고 있는 보아 구렁이의 그림이었다."
            }
        },
        {
            pageNumber: 2,
            content: "I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them.",
            contentByLang: {
                en: "I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them.",
                ko: "나는 내 걸작을 어른들에게 보여주며 내 그림이 무섭지 않냐고 물었다."
            }
        },
        {
            pageNumber: 3,
            content: "But they answered: 'Frighten? Why should any one be frightened by a hat?'",
            contentByLang: {
                en: "But they answered: 'Frighten? Why should any one be frightened by a hat?'",
                ko: "하지만 그들은 대답했다. '무섭다고? 모자가 왜 무섭니?'"
            }
        }
    ],
    "2": [
        {
            pageNumber: 1,
            content: "It was a bright cold day in April, and the clocks were striking thirteen.",
            contentByLang: {
                en: "It was a bright cold day in April, and the clocks were striking thirteen.",
                ko: "4월의 어느 맑고 추운 날이었고, 시계는 13시를 알리고 있었다."
            }
        },
    ],
    "3": [
        {
            pageNumber: 1,
            content: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.",
            contentByLang: {
                en: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.",
                ko: "지금보다 어리고 민감하던 시절 아버지가 내게 충고를 한마디 해주셨는데, 나는 아직도 그 말씀을 마음속 깊이 되새기고 있다."
            }
        },
    ],
    "4": [
        {
            pageNumber: 1,
            content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
            contentByLang: {
                en: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
                ko: "재산이 많은 미혼 남성이라면 으레 아내를 필요로 할 것이라는 점은 누구나 인정하는 진리다."
            }
        },
    ],
    "5": [
        {
            pageNumber: 1,
            content: "In a hole in the ground there lived a hobbit.",
            contentByLang: {
                en: "In a hole in the ground there lived a hobbit.",
                ko: "땅속 어느 굴에 호빗 하나가 살고 있었다."
            }
        },
    ],
    "6": [
        {
            pageNumber: 1,
            content: "The jungle was dense and unforgiving.",
            contentByLang: {
                en: "The jungle was dense and unforgiving.",
                ko: "정글은 울창하고 무자비했다."
            }
        },
    ]
};

export const mockComments: Comment[] = [
    {
        id: "c1",
        bookId: "1",
        userName: "Normal User",
        content: "This book changed my life!",
        createdAt: "2023-10-01",
        translations: {
            ko: { content: "이 책은 내 인생을 바꿨어요!" }
        }
    },
    {
        id: "c2",
        bookId: "1",
        userName: "User2",
        content: "The illustrations are beautiful.",
        createdAt: "2023-10-02",
        translations: {
            ko: { content: "삽화가 정말 아름답네요." }
        }
    },
    {
        id: "c3",
        bookId: "2",
        userName: "Normal User",
        content: "Scary but important read.",
        createdAt: "2023-10-05",
        translations: {
            ko: { content: "무섭지만 꼭 읽어야 할 책입니다." }
        }
    },
];

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

// 수정된 getLocalizedPage (contentByLang 우선 사용)
export function getLocalizedPage(page: Page, lang: string) {
    // 1순위: contentByLang 확인
    if (page.contentByLang && page.contentByLang[lang]) {
        return {
            ...page,
            content: page.contentByLang[lang]
        };
    }

    // 2순위: 기존 translations 확인 (레거시 지원)
    if (lang !== 'en' && page.translations?.[lang]?.content) {
        return {
            ...page,
            content: page.translations[lang].content
        };
    }

    // 3순위: 기본 content (보통 영어)
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
