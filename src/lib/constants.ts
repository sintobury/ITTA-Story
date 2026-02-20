export const SITE_NAME = "E-Library";

export const BOOK_MANAGEMENT_HEADERS = [
    { label: '표지', className: '' },
    { label: '제목', className: 'min-w-[200px]' },
    { label: '저자', className: '' },
    { label: '작업', className: '' },
];

export const USER_MANAGEMENT_HEADERS = [
    { label: '유저', className: '' },
    { label: '사유', className: '' },
    { label: '메모', className: '' },
    { label: '차단 일시', className: '' },
    { label: '작업', className: '' },
];

export const BLOCK_REASON_LABELS: Record<string, string> = {
    spam: '광고/스팸',
    abuse: '욕설/비방',
    other: '기타',
};
