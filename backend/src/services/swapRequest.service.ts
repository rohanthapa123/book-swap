import { SwapRequest } from '../entity/SwapRequest';
import { BookRepository } from '../repository/book.repository';
import { SwapRequestRepository } from '../repository/swapRequest.repository';

export class SwapRequestService {
  private swapRepo: SwapRequestRepository;
  private bookRepo: BookRepository;

  constructor() {
    this.swapRepo = new SwapRequestRepository();
    this.bookRepo = new BookRepository();
  }

  async create(
    data: { bookId: string; offeredBookId: string; message: string },
    requesterId: string
  ): Promise<SwapRequest> {
    // Find requested book with owner
    const requestedBook = await this.bookRepo.findById(data.bookId);
    if (!requestedBook) throw new Error('Requested book not found');

    // Find offered book with owner
    const offeredBook = await this.bookRepo.findById(data.offeredBookId);
    if (!offeredBook) throw new Error('Offered book not found');

    // Create swap request entity
    const swapRequest = await this.swapRepo.create({
      message: data.message,
      requester: offeredBook.owner, // set requester as user id
      receiver: offeredBook.owner,   // receiver is owner of offered book
      bookRequested: requestedBook,
      bookOffered: offeredBook,
      status: 'pending',  // or whatever default status you want
    });

    // Save and return
    return await this.swapRepo.create(swapRequest);
  }


  async findAll(): Promise<SwapRequest[]> {
    return this.swapRepo.findAll();
  }

  async findAllRelatedToMe(id: string): Promise<SwapRequest[]> {
    return this.swapRepo.findAllRelatedToMe(id);
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

  // ✅ Accept / Reject / Cancel Swap Request
  async updateStatus(id: string, status: 'accepted' | 'rejected' | 'cancelled'): Promise<SwapRequest> {
    const existing = await this.swapRepo.findById(id);
    if (!existing) throw new Error('Swap request not found');

    const updated = await this.swapRepo.update(id, { status });
    if (!updated) throw new Error(`Failed to update status to ${status}`);

    return updated;
  }
}
