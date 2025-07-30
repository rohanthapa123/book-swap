import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { BookApprovalRequest } from '../entity/BookApprovalRequest';

export class BookApprovalRequestRepository {
    private repo: Repository<BookApprovalRequest>;

    constructor() {
        this.repo = AppDataSource.getRepository(BookApprovalRequest);
    }

    async create(data: Partial<BookApprovalRequest>): Promise<BookApprovalRequest> {
        const request = this.repo.create(data);
        return await this.repo.save(request);
    }

    async findPending(): Promise<BookApprovalRequest[]> {
        return this.repo.find({
            where: { status: 'pending' },
            relations: ['book'],
        });
    }

    async updateStatus(
        id: string,
        status: 'approved' | 'rejected',
        adminNote?: string
    ): Promise<BookApprovalRequest | null> {
        const request = await this.repo.findOneBy({ id });
        if (!request) return null;

        request.status = status;
        if (adminNote) request.adminNote = adminNote;

        return await this.repo.save(request);
    }

    async findByBookId(bookId: string): Promise<BookApprovalRequest | null> {
        return this.repo.findOne({
            where: { book: { id: bookId } },
            relations: ['book'],
        });
    }
}
