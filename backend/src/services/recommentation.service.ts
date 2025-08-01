import { Book } from '../entity/Book';
import { Users } from '../entity/User';
import { BookRepository } from '../repository/book.repository';
import { UserRepository } from '../repository/user.repository';

export class BookRecommendationService {
    private bookRepository: BookRepository;
    private userRepository: UserRepository;

    constructor() {
        this.bookRepository = new BookRepository();
        this.userRepository = new UserRepository();
    }

    public async getContentBasedRecommendations(userId: string, limit: number = 10): Promise<Book[]> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new Error('User not found');

        const allBooks = await this.bookRepository.findAll();

        const userProfileWords = this.tokenizeUserPreferences(user);
        const bookTexts = this.prepareBookTexts(allBooks);
        const corpus = [...bookTexts, userProfileWords];
        const userVector = this.computeTFIDFVector(userProfileWords.join(" "), corpus);

        const scoredBooks = allBooks.map(book => {
            const bookText = this.getBookText(book);
            const bookVector = this.computeTFIDFVector(bookText, corpus);
            const similarity = this.calculateCosineSimilarity(userVector, bookVector);
            return { book, score: similarity * 10 };
        });

        return this.getTopScoredBooks(scoredBooks, limit);
    }


    private getTopScoredBooks(scoredBooks: Array<{ book: Book, score: number }>, limit: number): Book[] {
        return scoredBooks
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.book);
    }

    private tokenizeUserPreferences(user: Users): string[] {
        return user.preferences?.join(" ")
            .toLowerCase()
            .split(/\W+/)
            .filter(Boolean) || [];
    }

    private prepareBookTexts(books: Book[]): string[][] {
        return books.map(book =>
            this.getBookText(book)
                .toLowerCase()
                .split(/\W+/)
                .filter(Boolean)
        );
    }

    private getBookText(book: Book): string {
        return [book.title, book.desc, book.genre]
            .filter(Boolean)
            .join(" ");
    }


    private computeTFIDFVector(text: string, corpus: string[][]): Map<string, number> {
        const words = text.toLowerCase().split(/\W+/).filter(Boolean);
        const tfidf = new Map<string, number>();
        const uniqueTerms = Array.from(new Set(words));

        uniqueTerms.forEach(term => {
            const tf = this.computeTF(words, term);
            const idf = this.computeIDF(corpus, term);
            tfidf.set(term, tf * idf);
        });

        return tfidf;
    }

    private computeTF(words: string[], term: string): number {
        const termCount = words.filter(w => w === term).length;
        return termCount / words.length;
    }

    private computeIDF(docs: string[][], term: string): number {
        const containingDocs = docs.filter(doc => doc.includes(term)).length;
        return Math.log((docs.length + 1) / (containingDocs + 1)) + 1;
    }

    private calculateCosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
        const allTerms = new Set([...vec1.keys(), ...vec2.keys()]);
        let dotProduct = 0, mag1 = 0, mag2 = 0;

        allTerms.forEach(term => {
            const val1 = vec1.get(term) || 0;
            const val2 = vec2.get(term) || 0;
            dotProduct += val1 * val2;
            mag1 += val1 ** 2;
            mag2 += val2 ** 2;
        });

        return mag1 && mag2 ? dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2)) : 0;
    }
}
