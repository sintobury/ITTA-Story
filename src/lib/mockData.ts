import { Language } from "./translations";

// 책 데이터 인터페이스 정의
export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    coverUrl: string;
    likes: number;
    translations?: {
        [key in Language]?: {
            title?: string;
            author?: string;
            description?: string;
        };
    };
}

export interface Page {
    pageNumber: number;
    content: string;
    imageUrl?: string;
    translations?: {
        [key in Language]?: {
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
        [key in Language]?: {
            content?: string;
        };
    };
}

export const mockUserLikes: Record<string, string[]> = {
    "u1": ["1", "3"],
    "u2": ["2"],
};

export const mockBooks: Book[] = [
    {
        id: "1",
        title: "The Little Prince",
        author: "Antoine de Saint-Exupéry",
        description: "A young prince visits various planets in space, including Earth, and addresses themes of loneliness, friendship, love, and loss.",
        coverUrl: "https://placehold.co/400x600/2c3e50/FFFFFF?text=The+Little+Prince",
        likes: 124,
        translations: {
            ko: {
                title: "어린 왕자",
                author: "앙투안 드 생텍쥐페리",
                description: "사막에 불시착한 조종사가 어린 왕자를 만나 겪는 신비로운 이야기. 사랑과 우정, 그리고 상실에 대한 깊은 통찰을 담고 있습니다.",
            },
            ja: {
                title: "星の王子さま",
                author: "アントワーヌ・ド・サン＝テグジュペリ",
                description: "砂漠に不時着した飛行士が、小さな王子と出会う物語。孤独、友情、愛、そして喪失についてのテーマを扱っています。",
            },
            zh: {
                title: "小王子",
                author: "安托万·德·圣埃克苏佩里",
                description: "一位年轻的王子造访太空中的各个星球，包括地球，探讨了孤独、友谊、爱与失去的主题。",
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
        translations: {
            ko: {
                title: "1984",
                author: "조지 오웰",
                description: "미래의 전체주의 사회를 그린 디스토피아 소설. 감시와 통제, 진실의 왜곡을 경고합니다.",
            },
            ja: {
                title: "1984年",
                author: "ジョージ・オーウェル",
                description: "全体主義的ディストピアを描いたSF小説。監視社会と真実の統制についての警告。",
            },
            zh: {
                title: "1984",
                author: "乔治·奥威尔",
                description: "一部反乌托邦社会科幻小说，关于未来的警世寓言。",
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
        translations: {
            ko: {
                title: "위대한 개츠비",
                author: "F. 스콧 피츠제럴드",
                description: "1920년대 재즈 시대를 배경으로 한 꿈과 사랑, 그리고 비극적인 욕망의 이야기.",
            },
            ja: {
                title: "グレート・ギャツビー",
                author: "F・スコット・フィッツジェラルド",
                description: "1920年代のジャズ・エイジを舞台に、夢と愛、そして悲劇的な欲望を描いた小説。",
            },
            zh: {
                title: "了不起的盖茨比",
                author: "F·斯科特·菲茨杰拉德",
                description: "一部1925年的小说，背景设定在纽约长岛的爵士时代。",
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
        translations: {
            ko: {
                title: "잃어버린 도시",
                author: "인디아나 존스",
                description: "고대 문명의 발견을 다룬 시각적 여정.",
            }
        }
    }
];

export const mockPages: Record<string, Page[]> = {
    "1": [
        {
            pageNumber: 1,
            content: "Once when I was six years old I saw a magnificent picture in a book, called True Stories from Nature, about the primeval forest. It was a picture of a boa constrictor in the act of swallowing an animal.",
            imageUrl: "https://placehold.co/600x400/2c3e50/FFFFFF?text=Boa+Constrictor",
            translations: {
                ko: { content: "내가 여섯 살 적에, 나는 '자연의 체험'이라는 제목의 책에서 원시림에 관한 훌륭한 그림 하나를 보았다. 그것은 맹수를 집어삼키고 있는 보아 구렁이의 그림이었다." },
                ja: { content: "私が6歳のとき、『自然の体験』という本で、原始林に関する素晴らしい絵を見た。それは獣を飲み込んでいるボア・コンストリクターの絵だった。" },
                zh: { content: "当我还只有六岁的时候，在一本描写原始森林的名叫《大自然的故事》的书中，看到了一幅精彩的插画。画的是一条蟒蛇正在吞食一只野兽。" }
            }
        },
        {
            pageNumber: 2,
            content: "I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them.",
            translations: {
                ko: { content: "나는 내 걸작을 어른들에게 보여주며 내 그림이 무섭지 않냐고 물었다." },
                ja: { content: "私は傑作を大人たちに見せて、怖くないかと尋ねた。" },
                zh: { content: "我把我的杰作拿给大人看，问他们我的画是不是叫他们害怕。" }
            }
        },
        {
            pageNumber: 3,
            content: "But they answered: 'Frighten? Why should any one be frightened by a hat?'",
            translations: {
                ko: { content: "하지만 그들은 대답했다. '무섭다고? 모자가 왜 무섭니?'" },
                ja: { content: "しかし、彼らは答えた。「怖い？なぜ帽子が怖いの？」" },
                zh: { content: "他们回答我说：“帽子有什么可怕的？”" }
            }
        }
    ],
    "2": [
        { pageNumber: 1, content: "It was a bright cold day in April, and the clocks were striking thirteen.", translations: { ko: { content: "4월의 어느 맑고 추운 날이었고, 시계는 13시를 알리고 있었다." } } },
    ],
    "3": [
        { pageNumber: 1, content: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.", translations: { ko: { content: "지금보다 어리고 민감하던 시절 아버지가 내게 충고를 한마디 해주셨는데, 나는 아직도 그 말씀을 마음속 깊이 되새기고 있다." } } },
    ],
    "4": [
        { pageNumber: 1, content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", translations: { ko: { content: "재산이 많은 미혼 남성이라면 으레 아내를 필요로 할 것이라는 점은 누구나 인정하는 진리다." } } },
    ],
    "5": [
        { pageNumber: 1, content: "In a hole in the ground there lived a hobbit.", translations: { ko: { content: "땅속 어느 굴에 호빗 하나가 살고 있었다." } } },
    ],
    "6": [
        { pageNumber: 1, content: "The jungle was dense and unforgiving.", translations: { ko: { content: "정글은 울창하고 무자비했다." } } },
    ]
};

export const mockComments: Comment[] = [
    {
        id: "c1",
        bookId: "1",
        userName: "User1",
        content: "This book changed my life!",
        createdAt: "2023-10-01",
        translations: {
            ko: { content: "이 책은 내 인생을 바꿨어요!" },
            ja: { content: "この本は私の人生を変えました！" },
            zh: { content: "这本书改变了我的人生！" }
        }
    },
    {
        id: "c2",
        bookId: "1",
        userName: "User2",
        content: "The illustrations are beautiful.",
        createdAt: "2023-10-02",
        translations: {
            ko: { content: "삽화가 정말 아름답네요." },
            ja: { content: "イラストがとても美しいです。" },
            zh: { content: "插图很美。" }
        }
    },
    {
        id: "c3",
        bookId: "2",
        userName: "User1",
        content: "Scary but important read.",
        createdAt: "2023-10-05",
        translations: {
            ko: { content: "무섭지만 꼭 읽어야 할 책입니다." }
        }
    },
];

// 다국어 컨텐츠를 가져오는 헬퍼 함수
export function getLocalizedBook(book: Book, lang: Language) {
    if (lang === 'en') return book;
    const translation = book.translations?.[lang];
    return {
        ...book,
        title: translation?.title || book.title,
        author: translation?.author || book.author,
        description: translation?.description || book.description,
    };
}

export function getLocalizedPage(page: Page, lang: Language) {
    if (lang === 'en') return page;
    const translation = page.translations?.[lang];
    return {
        ...page,
        content: translation?.content || page.content,
    };
}

export function getLocalizedComment(comment: Comment, lang: Language) {
    if (lang === 'en') return comment;
    const translation = comment.translations?.[lang];
    return {
        ...comment,
        content: translation?.content || comment.content,
    };
}
