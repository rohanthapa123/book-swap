import { BookApprovalRequest } from '../entity/BookApprovalRequest';
import { BookApprovalRequestRepository } from '../repository/bookApprovalRequest.repository';

export class BookApprovalRequestService {
    private approvalRepo: BookApprovalRequestRepository;

    constructor() {
        this.approvalRepo = new BookApprovalRequestRepository();
    }

    async create(data: Partial<BookApprovalRequest>): Promise<BookApprovalRequest> {
        return await this.approvalRepo.create(data);
    }

    async findPending(): Promise<BookApprovalRequest[]> {
        return await this.approvalRepo.findPending();
    }

    async updateStatus(
        id: string,
        status: 'approved' | 'rejected',
        adminNote?: string
    ): Promise<BookApprovalRequest> {
        const updated = await this.approvalRepo.updateStatus(id, status, adminNote);
        if (!updated) throw new Error('Approval request not found');
        return updated;
    }

    async findByBookId(bookId: string): Promise<BookApprovalRequest | null> {
        return await this.approvalRepo.findByBookId(bookId);
    }
}
