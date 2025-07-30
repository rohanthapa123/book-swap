import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Users } from '../entity/User';

export class UserRepository {
  private repo: Repository<Users>;

  constructor() {
    this.repo = AppDataSource.getRepository(Users);
  }

  // Get all users with pagination
  async findAll(limit: number, offset: number) {
    return this.repo.find({
      take: limit,
      skip: offset,
    });
  }

  // Create a new user
  async create(data: Partial<Users>) {
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  // Get user by ID
  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
    });
  }

  // Get user by email
  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
    });
  }

  // Get user by ID with relations (optional)
  async findOneWithRelations(userId: string) {
    return this.repo.findOne({
      where: { id: userId },
      relations: ['books'], // add actual relation name like 'books', 'swapRequests', etc.
    });
  }

  // Update user data
  async update(id: string, data: Partial<Users>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) return null;

    this.repo.merge(user, data);
    return await this.repo.save(user);
  }

  // Delete a user
  async delete(id: string) {
    const user = await this.repo.findOneBy({ id });
    if (!user) return null;

    await this.repo.remove(user);
    return { message: 'User deleted successfully' };
  }
}
