
import { supabase } from './supabase';
import { mockBooks, mockPages } from './seedData';

// Helper to generate deterministic UUID from numeric ID string
const generateUUID = (id: string): string => {
    const paddedId = id.padStart(12, '0');
    return `00000000-0000-0000-0000-${paddedId}`;
};

export const resetDatabase = async () => {
    console.log("Resetting database...");
    const logs: string[] = [];
    try {
        const { error } = await supabase.from('books').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all

        if (error) {
            logs.push(`❌ Failed to reset database: ${error.message}`);
        } else {
            logs.push("🗑️ Database cleared (Books deleted).");
        }
    } catch (e: any) {
        logs.push(`🔥 Reset Error: ${e.message}`);
    }
    return logs;
};

export const seedDatabase = async () => {
    console.log("Starting seeding...");
    const logs: string[] = [];

    try {
        for (const book of mockBooks) {
            logs.push(`Migrating Book: ${book.title}...`);

            // Use deterministic UUID based on mock ID
            const bookUUID = generateUUID(book.id);

            // 1. Upsert Book (Insert or Update)
            const { data: newBook, error: bookError } = await supabase
                .from('books')
                .upsert({
                    id: bookUUID, // Explicitly set UUID
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
                console.error(`Error upserting book ${book.title}:`, bookError);
                logs.push(`❌ Failed to upsert book: ${book.title} - ${JSON.stringify(bookError)}`);
                continue;
            }

            const newBookId = newBook.id;
            // logs.push(`✅ Upserted Book ID: ${newBookId}`);

            // 2. Upsert Pages (Delete existing first to avoid duplication or complex diffing?)
            // For simplicity in seed, let's delete pages for this book and re-insert.
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
                    console.error(`Error inserting pages for ${book.title}:`, pageError);
                    logs.push(`❌ Failed to insert pages for: ${book.title} - ${pageError.code} / ${pageError.message}`);
                } else {
                    logs.push(`✅ Processed ${book.title} (${pages.length} pages).`);
                }
            } else {
                logs.push(`ℹ️ No pages for ${book.title}.`);
            }
        }
        logs.push("🎉 Migration Completed!");
    } catch (e: any) {
        console.error("Migration Fatal Error:", e);
        logs.push(`🔥 Fatal Error: ${e.message}`);
    }

    return logs;
};
