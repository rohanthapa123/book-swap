import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { SwapRequest } from '../entity/SwapRequest';

export class SwapRequestRepository {
  private repo: Repository<SwapRequest>;

  constructor() {
    this.repo = AppDataSource.getRepository(SwapRequest);
  }

  async create(data: Partial<SwapRequest>): Promise<SwapRequest> {
    const request = this.repo.create(data);
    return await this.repo.save(request);
  }

  async findAll(): Promise<SwapRequest[]> {
    return this.repo.find({
      relations: ['requester', 'receiver', 'bookRequested', 'bookOffered'],
    });
  }

  async findById(id: string): Promise<SwapRequest | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['requester', 'receiver', 'bookRequested', 'bookOffered'],
    });
  }

  async findByUser(userId: string): Promise<SwapRequest[]> {
    return this.repo.find({
      where: [
        { requester: { id: userId } },
        { receiver: { id: userId } }
      ],
      relations: ['requester', 'receiver'],
    });
  }

  async update(id: string, data: Partial<SwapRequest>): Promise<SwapRequest | null> {
    const request = await this.repo.findOneBy({ id });
    if (!request) return null;

    this.repo.merge(request, data);
    return await this.repo.save(request);
  }

  async delete(id: string): Promise<{ message: string } | null> {
    const request = await this.repo.findOneBy({ id });
    if (!request) return null;

    await this.repo.remove(request);
    return { message: 'Swap request deleted successfully' };
  }
}
