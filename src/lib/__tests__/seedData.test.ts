import { getLocalizedBook, getLocalizedPage } from '../seedData';
import { Book, Page } from '@/types';

describe('seedData utils', () => {
    const mockBook: Book = {
        id: '1',
        title: 'Original Title',
        author: 'Original Author',
        description: 'Original Desc',
        coverUrl: '',
        likes: 0,
        availableLanguages: ['en', 'ko'],
        translations: {
            ko: {
                title: 'Korean Title',
                author: 'Korean Author',
                description: 'Korean Desc',
            },
        },
    };

    test('getLocalizedBook returns original for en', () => {
        const result = getLocalizedBook(mockBook, 'en');
        expect(result.title).toBe('Original Title');
    });

    test('getLocalizedBook returns localized for ko', () => {
        const result = getLocalizedBook(mockBook, 'ko');
        expect(result.title).toBe('Korean Title');
        expect(result.author).toBe('Korean Author');
    });

    const mockPage: Page = {
        pageNumber: 1,
        content: 'Original Content',
        contentByLang: {
            en: 'English Content',
            ko: 'Korean Content',
        }
    };

    test('getLocalizedPage returns content by lang', () => {
        const resultKo = getLocalizedPage(mockPage, 'ko');
        expect(resultKo.content).toBe('Korean Content');

        const resultEn = getLocalizedPage(mockPage, 'en');
        expect(resultEn.content).toBe('English Content');
    });
});
