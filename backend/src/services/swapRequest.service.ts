import { SwapRequest } from '../entity/SwapRequest';
import { SwapRequestRepository } from '../repository/swapRequest.repository';

export class SwapRequestService {
    private swapRepo: SwapRequestRepository;

    constructor() {
        this.swapRepo = new SwapRequestRepository();
    }

    async create(data: Partial<SwapRequest>): Promise<SwapRequest> {
        return this.swapRepo.create(data);
    }

    async findAll(): Promise<SwapRequest[]> {
        return this.swapRepo.findAll();
    }

    async findById(id: string): Promise<SwapRequest> {
        const request = await this.swapRepo.findById(id);
        if (!request) throw new Error('Swap request not found');
        return request;
    }

    async update(id: string, data: Partial<SwapRequest>): Promise<SwapRequest> {
        const updated = await this.swapRepo.update(id, data);
        if (!updated) throw new Error('Swap request not found for update');
        return updated;
    }

    async delete(id: string): Promise<{ message: string }> {
        const deleted = await this.swapRepo.delete(id);
        if (!deleted) throw new Error('Swap request not found for deletion');
        return deleted;
    }
}
