
import { supabase } from './supabase';
import { mockBooks, mockPages } from './seedData';

// 숫자 ID 문자열로부터 결정론적 UUID 생성 헬퍼
const generateUUID = (id: string): string => {
    const paddedId = id.padStart(12, '0');
    return `00000000-0000-0000-0000-${paddedId}`;
};

export const resetDatabase = async () => {
    console.log("데이터베이스 초기화 중...");
    const logs: string[] = [];
    try {
        const { error } = await supabase.from('books').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // 전체 삭제

        if (error) {
            logs.push(`❌ 데이터베이스 초기화 실패: ${error.message}`);
        } else {
            logs.push("🗑️ 데이터베이스 초기화 완료 (책 데이터 삭제됨).");
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            logs.push(`🔥 초기화 오류: ${e.message}`);
        } else {
            logs.push(`🔥 초기화 오류: 알 수 없는 오류`);
        }
    }
    return logs;
};

export const seedDatabase = async () => {
    console.log("데이터 시딩 시작...");
    const logs: string[] = [];

    try {
        for (const book of mockBooks) {
            logs.push(`책 마이그레이션 중: ${book.title}...`);

            // mock ID 기반의 UUID 사용
            const bookUUID = generateUUID(book.id);

            // 1. 책 정보 업서트 (삽입 또는 수정)
            const { data: newBook, error: bookError } = await supabase
                .from('books')
                .upsert({
                    id: bookUUID, // UUID 명시적 설정
                    title: book.title,
                    author: book.author,
                    description: book.description,
                    cover_url: book.coverUrl,
                    likes_count: book.likes,
                    available_languages: book.availableLanguages,
                    translations: book.translations || {},
                })
                .select()
                .single();

            if (bookError) {
                console.error(`책 업서트 오류 ${book.title}:`, bookError);
                logs.push(`❌ 책 업서트 실패: ${book.title} - ${JSON.stringify(bookError)}`);
                continue;
            }

            const newBookId = newBook.id;

            // 2. 페이지 정보 업서트 (중복 방지를 위해 기존 데이터 삭제 후 재생성)
            // 시딩 편의성을 위해 해당 책의 페이지를 모두 삭제하고 다시 삽입합니다.
            await supabase.from('pages').delete().eq('book_id', newBookId);

            const pages = mockPages[book.id] || [];
            if (pages.length > 0) {
                const pagesToInsert = pages.map(page => ({
                    book_id: newBookId,
                    page_number: page.pageNumber,
                    image_url: page.imageUrl,
                    content_by_lang: page.contentByLang || { ko: page.content }
                }));

                const { error: pageError } = await supabase
                    .from('pages')
                    .insert(pagesToInsert);

                if (pageError) {
                    console.error(`${book.title} 페이지 삽입 오류:`, pageError);
                    logs.push(`❌ 페이지 삽입 실패: ${book.title} - ${pageError.code} / ${pageError.message}`);
                } else {
                    logs.push(`✅ 처리 완료: ${book.title} (${pages.length} 페이지).`);
                }
            } else {
                logs.push(`ℹ️ 페이지 없음: ${book.title}.`);
            }
        }
        logs.push("🎉 마이그레이션 완료!");
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error("마이그레이션 치명적 오류:", e);
            logs.push(`🔥 치명적 오류: ${e.message}`);
        } else {
            console.error("마이그레이션 치명적 오류:", e);
            logs.push(`🔥 치명적 오류: 알 수 없는 오류`);
        }
    }

    return logs;
};
