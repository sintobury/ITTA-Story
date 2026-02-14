export type Language = 'en' | 'ko';

export const translations = {
    en: {
        nav: {
            home: "Home",
            admin: "Admin Page",
            login: "Login",
            signup: "Sign Up",
            logout: "Logout",
            loginAdmin: "Login as Admin",
            hello: "Hello",
            myPage: "My Page",
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
        },
        myPage: {
            title: "My Page",
            tabs: {
                reading: "Reading List",
                liked: "Liked Books",
                comments: "My Comments"
            },
            resume: "Resume: Page",
            noReading: "No books currently being read.",
            noLiked: "No liked books yet.",
            noComments: "No comments written yet.",
            goBrowse: "Browse Books",
            unit: "Page"
        }
    },
    ko: {
        nav: {
            home: "홈",
            admin: "관리자 페이지",
            login: "로그인",
            signup: "회원가입",
            logout: "로그아웃",
            loginAdmin: "관리자 로그인",
            hello: "반갑습니다",
            myPage: "마이페이지",
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
        },
        myPage: {
            title: "마이페이지",
            tabs: {
                reading: "📚 읽고 있는 책",
                liked: "❤️ 좋아요한 책",
                comments: "💬 내 댓글"
            },
            resume: "이어보기:",
            noReading: "아직 읽고 있는 책이 없습니다.",
            noLiked: "좋아요한 책이 없습니다.",
            noComments: "작성한 댓글이 없습니다.",
            goBrowse: "책 구경하러 가기",
            unit: "페이지"
        }
    }
};
