import bcrypt from 'bcrypt';
import { Users } from '../entity/User';
import { UserRepository } from '../repository/user.repository';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }


  async register(data: Partial<Users>): Promise<Users> {
    return await this.userRepo.create(data);
  }


  async validateCredential(
    email: string,
    password: string,
  ): Promise<Users | null> {
    const users = await this.userRepo.findByEmail(email);
    if (!users) throw new Error('Users not found');

    const isMatch = await bcrypt.compare(password, users.password);
    // console.log(isMatch);
    if (!isMatch) throw new Error('Invalid Credentials');

    return users;
  }
}
