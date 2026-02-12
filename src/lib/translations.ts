export type Language = 'en' | 'ko' | 'ja' | 'zh';

export const translations = {
    en: {
        nav: {
            home: "Home",
            admin: "Admin Page",
            login: "Login",
            signup: "Sign Up",
            logout: "Logout",
            loginUser: "Login as User",
            loginAdmin: "Login as Admin",
            hello: "Hello",
        },
        home: {
            welcome: "Welcome to E-Library",
            subtitle: "Discover your next favorite book",
            searchPlaceholder: "Search for books...",
            noResults: "No results found. 😢",
            tryAgain: "Please try a different keyword.",
            filter: {
                title: "Title",
                author: "Author"
            },
            sort: {
                newest: "Newest",
                oldest: "Oldest",
                popular: "Popular"
            }
        },
        bookDetail: {
            readNow: "Read Now",
            back: "Back to Details",
            closeBook: "Close Book",
            previous: "Previous",
            next: "Next Page",
            locked: "Please Login to read this book and view comments.",
            comments: "Comments",
            noComments: "No comments yet.",
            postComment: "Post Comment",
            placeholder: "Write a comment...",
            loginToComment: "Login to leave a comment! ✍️",
            goToLogin: "Go to Login",
            deleteAdmin: "Delete",
            blockUser: "Block",
            blockConfirm: "Block this user?",
            blockReason: "Reason for blocking:",
            blockMemo: "Memo (Optional):",
            cancel: "Cancel",
            confirmBlock: "Block",
            reasons: {
                spam: "Spam/Ad",
                abuse: "Abuse/Harassment",
                other: "Other"
            },
            like: "Like",
            liked: "Liked",
            likeTooltip: {
                loginRequired: "Login to Like",
                like: "Like",
                unlike: "Unlike"
            },
            copyrightWarning: "🚫 The copyright of this fairy tale belongs to the site operator and the author. Unauthorized reproduction and distribution are prohibited.",
            rightClickWarning: "Right-click is disabled to protect copyright."
        },
        admin: {
            dashboard: "Admin Page",
            upload: "Upload New Book",
            manage: "Manage Books",
            manageUsers: "Manage Users",
            blockedUsers: "Blocked Users",
            noBlockedUsers: "No blocked users.",
            unblock: "Unblock",
            table: {
                cover: "Cover",
                title: "Title",
                author: "Author",
                actions: "Actions",
                user: "User",
                reason: "Reason",
                memo: "Memo",
                date: "Date",
            },
            edit: "Edit",
            delete: "Delete",
            uploadPage: {
                title: "Upload New Book",
                editTitle: "Edit Book",
                cancel: "Cancel",
                section1: "1. Book Information",
                section2: "2. Pages Content",
                addPage: "Add Page",
                deletePage: "Delete Page",
                remove: "Remove",
                removeImage: "Remove Image",
                selectImage: "Select Image",
                dragDrop: "or drag and drop file here",
                currentCover: "Current Cover",
                currentImage: "Current Image",
                publish: "Publish Book",
                save: "Save Changes",
                successPublish: "Book published successfully!",
                successEdit: "Book updated successfully!",
                labels: {
                    title: "Title",
                    author: "Author",
                    desc: "Description",
                    cover: "Cover Image",
                    content: "Text Content",
                    illustration: "Illustration (Optional)",
                    page: "Page"
                },
                placeholders: {
                    title: "e.g. The Little Prince",
                    author: "e.g. Antoine de Saint-Exupéry",
                    content: "Enter the text for this page..."
                }
            },
            editor: {
                bold: "Bold",
                italic: "Italic",
                underline: "Underline",
                strike: "Strike",
                size: "Font Size",
                color: "Text Color",
                align: "Align",
                sizes: {
                    small: "Small",
                    normal: "Normal",
                    large: "Large",
                    huge: "Huge"
                }
            }
        },
        auth: {
            loginTitle: "Login",
            signupTitle: "Sign Up",
            id: "ID",
            password: "Password",
            nickname: "Nickname",
            checkDuplicate: "Check Duplicate",
            loginBtn: "Login",
            signupBtn: "Sign Up",
            noAccount: "Don't have an account?",
            hasAccount: "Already have an account?",
            idPlaceholder: "Enter your ID",
            pwPlaceholder: "Enter your password",
            nickPlaceholder: "Enter your nickname",
            idAvailable: "ID is available!",
            idTaken: "ID is already taken.",
            checkIdFirst: "Please check ID duplication first.",
        }
    },
    ko: {
        nav: {
            home: "홈",
            admin: "관리자 페이지",
            login: "로그인",
            signup: "회원가입",
            logout: "로그아웃",
            loginUser: "사용자 로그인",
            loginAdmin: "관리자 로그인",
            hello: "반갑습니다",
        },
        home: {
            welcome: "E-Library에 오신 것을 환영합니다",
            subtitle: "당신의 인생 책을 찾아보세요",
            searchPlaceholder: "찾고 싶은 책을 입력하세요...",
            noResults: "검색 결과가 없습니다. 😢",
            tryAgain: "다른 검색어로 다시 시도해보세요.",
            filter: {
                title: "제목",
                author: "작가"
            },
            sort: {
                newest: "최신순",
                oldest: "과거순",
                popular: "인기순"
            }
        },
        bookDetail: {
            readNow: "지금 읽기",
            back: "상세 정보로 돌아가기",
            closeBook: "책 덮기",
            previous: "이전",
            next: "다음 페이지",
            locked: "책을 읽고 댓글을 보려면 로그인해주세요.",
            comments: "댓글",
            noComments: "아직 댓글이 없습니다.",
            postComment: "댓글 등록",
            placeholder: "댓글을 작성하세요...",
            loginToComment: "로그인하고 댓글을 남겨보세요! ✍️",
            goToLogin: "로그인하러 가기",
            deleteAdmin: "삭제",
            blockUser: "차단",
            blockConfirm: "이 유저를 차단하시겠습니까?",
            blockReason: "차단 사유:",
            blockMemo: "메모 (선택사항):",
            cancel: "취소",
            confirmBlock: "차단하기",
            reasons: {
                spam: "광고/스팸",
                abuse: "욕설/비방",
                other: "기타"
            },
            like: "좋아요",
            liked: "좋아요 취소",
            likeTooltip: {
                loginRequired: "로그인 후 좋아요 가능",
                like: "좋아요",
                unlike: "좋아요 취소"
            },
            copyrightWarning: "🚫 본 동화의 저작권은 사이트 운영자와 작가에게 있으며, 무단 복제 및 배포를 금합니다.",
            rightClickWarning: "저작권 보호를 위해 우클릭이 제한됩니다."
        },
        admin: {
            dashboard: "관리자 페이지",
            upload: "새 책 업로드",
            manage: "책 관리",
            manageUsers: "유저 관리",
            blockedUsers: "차단된 유저 목록",
            noBlockedUsers: "차단된 유저가 없습니다.",
            unblock: "차단 해제",
            table: {
                cover: "표지",
                title: "제목",
                author: "저자",
                actions: "작업",
                user: "유저",
                reason: "사유",
                memo: "메모",
                date: "차단 일시",
            },
            edit: "수정",
            delete: "삭제",
            uploadPage: {
                title: "새 책 업로드",
                editTitle: "책 수정",
                cancel: "취소",
                section1: "1. 책 정보",
                section2: "2. 페이지 내용",
                addPage: "페이지 추가",
                deletePage: "페이지 삭제",
                remove: "삭제",
                removeImage: "이미지 삭제",
                selectImage: "이미지 선택",
                dragDrop: "또는 파일을 여기로 드래그하세요",
                currentCover: "현재 표지",
                currentImage: "현재 이미지",
                publish: "책 발행하기",
                save: "변경사항 저장",
                successPublish: "책이 성공적으로 발행되었습니다!",
                successEdit: "책 정보가 수정되었습니다!",
                labels: {
                    title: "제목",
                    author: "저자",
                    desc: "설명",
                    cover: "표지 이미지",
                    content: "텍스트 내용",
                    illustration: "삽화 (선택사항)",
                    page: "페이지"
                },
                placeholders: {
                    title: "예: 어린 왕자",
                    author: "예: 앙투안 드 생텍쥐페리",
                    content: "이 페이지의 내용을 입력하세요... (스타일 적용 가능)"
                }
            },
            editor: {
                bold: "굵게",
                italic: "기울임",
                underline: "밑줄",
                strike: "취소선",
                size: "글자 크기",
                color: "글자 색상",
                align: "정렬",
                sizes: {
                    small: "작게",
                    normal: "보통",
                    large: "크게",
                    huge: "아주 크게"
                }
            }
        },
        auth: {
            loginTitle: "로그인",
            signupTitle: "회원가입",
            id: "아이디",
            password: "비밀번호",
            nickname: "닉네임",
            checkDuplicate: "중복 확인",
            loginBtn: "로그인",
            signupBtn: "가입하기",
            noAccount: "계정이 없으신가요?",
            hasAccount: "이미 계정이 있으신가요?",
            idPlaceholder: "아이디를 입력하세요",
            pwPlaceholder: "비밀번호를 입력하세요",
            nickPlaceholder: "닉네임을 입력하세요",
            idAvailable: "사용 가능한 아이디입니다!",
            idTaken: "이미 사용 중인 아이디입니다.",
            checkIdFirst: "아이디 중복 확인을 해주세요.",
        }
    },
    ja: {
        nav: {
            home: "ホーム",
            admin: "管理者ページ",
            login: "ログイン",
            signup: "会員登録",
            logout: "ログアウト",
            loginUser: "ユーザーログイン",
            loginAdmin: "管理者ログイン",
            hello: "こんにちは",
        },
        home: {
            welcome: "E-Libraryへようこそ",
            subtitle: "お気に入りの一冊を見つけましょう",
            searchPlaceholder: "本を検索...",
            noResults: "検索結果がありません。😢",
            tryAgain: "別のキーワードで試してみてください。",
            filter: {
                title: "タイトル",
                author: "著者"
            },
            sort: {
                newest: "最新順",
                oldest: "古い順",
                popular: "人気順"
            }
        },
        bookDetail: {
            readNow: "今すぐ読む",
            back: "詳細に戻る",
            closeBook: "本を閉じる",
            previous: "前へ",
            next: "次へ",
            locked: "本を読んだりコメントを見るにはログインしてください。",
            comments: "コメント",
            noComments: "まだコメントはありません。",
            postComment: "コメントを投稿",
            placeholder: "コメントを入力...",
            loginToComment: "ログインしてコメントを残しましょう！✍️",
            goToLogin: "ログイン画面へ",
            deleteAdmin: "削除",
            blockUser: "ブロック",
            blockConfirm: "このユーザーをブロックしますか？",
            blockReason: "ブロックの理由:",
            blockMemo: "メモ (オプション):",
            cancel: "キャンセル",
            confirmBlock: "ブロックする",
            reasons: {
                spam: "スパム/広告",
                abuse: "悪口/誹謗中傷",
                other: "その他"
            },
            like: "いいね",
            liked: "いいね済み",
            likeTooltip: {
                loginRequired: "ログインして「いいね」",
                like: "いいね",
                unlike: "いいね解除"
            },
            copyrightWarning: "🚫 この童話の著作権はサイト運営者と著者にあり、無断複製および配布を禁じます。",
            rightClickWarning: "著作権保護のため右クリックは制限されています。"
        },
        admin: {
            dashboard: "管理者ページ",
            upload: "新しい本をアップロード",
            manage: "本の管理",
            manageUsers: "ユーザー管理",
            blockedUsers: "ブロックされたユーザー",
            noBlockedUsers: "ブロックされたユーザーはいません。",
            unblock: "ブロック解除",
            table: {
                cover: "表紙",
                title: "タイトル",
                author: "著者",
                actions: "操作",
                user: "ユーザー",
                reason: "理由",
                memo: "メモ",
                date: "日時",
            },
            edit: "編集",
            delete: "削除",
            uploadPage: {
                title: "新しい本をアップロード",
                editTitle: "本を編集",
                cancel: "キャンセル",
                section1: "1. 本の情報",
                section2: "2. ページの内容",
                addPage: "ページを追加",
                deletePage: "ページ削除",
                remove: "削除",
                removeImage: "画像を削除",
                selectImage: "画像を選択",
                dragDrop: "またはファイルをここにドラッグ",
                currentCover: "現在の表紙",
                currentImage: "現在の画像",
                publish: "本を公開",
                save: "変更を保存",
                successPublish: "本が正常に公開されました！",
                successEdit: "本の情報が修正されました！",
                labels: {
                    title: "タイトル",
                    author: "著者",
                    desc: "説明",
                    cover: "表紙画像",
                    content: "テキスト内容",
                    illustration: "挿絵 (オプション)",
                    page: "ページ"
                },
                placeholders: {
                    title: "例: 星の王子さま",
                    author: "例: アントワーヌ・ド・サン＝テグジュペリ",
                    content: "このページのテキストを入力..."
                }
            },
            editor: {
                bold: "太字",
                italic: "斜体",
                underline: "下線",
                strike: "取り消し線",
                size: "文字サイズ",
                color: "文字色",
                align: "配置",
                sizes: {
                    small: "小さく",
                    normal: "普通",
                    large: "大きく",
                    huge: "非常に大きく"
                }
            }
        },
        auth: {
            loginTitle: "ログイン",
            signupTitle: "会員登録",
            id: "ID",
            password: "パスワード",
            nickname: "ニックネーム",
            checkDuplicate: "重複確認",
            loginBtn: "ログイン",
            signupBtn: "登録する",
            noAccount: "アカウントをお持ちでないですか？",
            hasAccount: "すでにアカウントをお持ちですか？",
            idPlaceholder: "IDを入力してください",
            pwPlaceholder: "パスワードを入力してください",
            nickPlaceholder: "ニックネームを入力してください",
            idAvailable: "使用可能なIDです！",
            idTaken: "すでに使用されているIDです。",
            checkIdFirst: "IDの重複確認を行ってください。",
        }
    },
    zh: {
        nav: {
            home: "首页",
            admin: "管理员页面",
            login: "登录",
            signup: "注册",
            logout: "登出",
            loginUser: "用户登录",
            loginAdmin: "管理员登录",
            hello: "你好",
        },
        home: {
            welcome: "欢迎来到电子图书馆",
            subtitle: "发现你的下一本好书",
            searchPlaceholder: "搜索书籍...",
            noResults: "未找到相关结果。😢",
            tryAgain: "请尝试其他关键词。",
            filter: {
                title: "标题",
                author: "作者"
            },
            sort: {
                newest: "最新",
                oldest: "最早",
                popular: "热门"
            }
        },
        bookDetail: {
            readNow: "立即阅读",
            back: "返回详情",
            closeBook: "合上书本",
            previous: "上一页",
            next: "下一页",
            locked: "请登录以阅读本书并查看评论。",
            comments: "评论",
            noComments: "暂无评论。",
            postComment: "发表评论",
            placeholder: "写下你的评论...",
            loginToComment: "登录后发表评论！✍️",
            goToLogin: "前往登录",
            deleteAdmin: "削除",
            blockUser: "屏蔽",
            blockConfirm: "确定要屏蔽此用户吗？",
            blockReason: "屏蔽理由:",
            blockMemo: "备注 (可选):",
            cancel: "取消",
            confirmBlock: "屏蔽",
            reasons: {
                spam: "广告/垃圾信息",
                abuse: "辱骂/骚扰",
                other: "其他"
            },
            like: "点赞",
            liked: "已点赞",
            likeTooltip: {
                loginRequired: "登录后点赞",
                like: "点赞",
                unlike: "取消点赞"
            },
            copyrightWarning: "🚫 本童话版权归网站运营者和作者所有，禁止擅自复制及发。",
            rightClickWarning: "为保护版权，禁止右键点击。"
        },
        admin: {
            dashboard: "管理员页面",
            upload: "上传新书",
            manage: "图书管理",
            manageUsers: "用户管理",
            blockedUsers: "已屏蔽用户",
            noBlockedUsers: "没有屏蔽的用户。",
            unblock: "解除屏蔽",
            table: {
                cover: "封面",
                title: "标题",
                author: "作者",
                actions: "操作",
                user: "用户",
                reason: "理由",
                memo: "备注",
                date: "日期",
            },
            edit: "编辑",
            delete: "删除",
            uploadPage: {
                title: "上传新书",
                editTitle: "编辑图书",
                cancel: "取消",
                section1: "1. 图书信息",
                section2: "2. 页面内容",
                addPage: "添加页面",
                deletePage: "删除页面",
                remove: "删除",
                removeImage: "删除图片",
                selectImage: "选择图片",
                dragDrop: "或将文件拖到此处",
                currentCover: "当前封面",
                currentImage: "当前图片",
                publish: "发布图书",
                save: "保存更改",
                successPublish: "图书发布成功！",
                successEdit: "图书信息已更新！",
                labels: {
                    title: "标题",
                    author: "作者",
                    desc: "描述",
                    cover: "封面图片",
                    content: "文本内容",
                    illustration: "插图 (可选)",
                    page: "页码"
                },
                placeholders: {
                    title: "例如：小王子",
                    author: "例如：安托万·德·圣埃克苏佩里",
                    content: "输入此页面的文本..."
                }
            },
            editor: {
                bold: "加粗",
                italic: "斜体",
                underline: "下划线",
                strike: "删除线",
                size: "字体大小",
                color: "字体颜色",
                align: "对齐",
                sizes: {
                    small: "小",
                    normal: "普通",
                    large: "大",
                    huge: "特大"
                }
            }
        },
        auth: {
            loginTitle: "登录",
            signupTitle: "注册",
            id: "ID",
            password: "密码",
            nickname: "昵称",
            checkDuplicate: "检查重复",
            loginBtn: "登录",
            signupBtn: "注册",
            noAccount: "没有账号？",
            hasAccount: "已有账号？",
            idPlaceholder: "请输入ID",
            pwPlaceholder: "请输入密码",
            nickPlaceholder: "请输入昵称",
            idAvailable: "ID可用！",
            idTaken: "ID已被使用。",
            checkIdFirst: "请先检查ID重复。",
        }
    }
};
