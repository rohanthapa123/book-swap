import { Users } from '../entity/User';
import { UserRepository } from '../repository/user.repository';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async findAll(limit: number, offset: number): Promise<Users[]> {
    return this.userRepo.findAll(limit, offset);
  }

  async findById(id: string): Promise<Users> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async update(id: string, data: Partial<Users>): Promise<Users> {
    const updatedUser = await this.userRepo.update(id, data);
    if (!updatedUser) throw new Error('User not found for update');
    return updatedUser;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.userRepo.delete(id);
    if (!deleted) throw new Error('User not found for deletion');
    return deleted;
  }
}
