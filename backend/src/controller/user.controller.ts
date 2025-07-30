import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import logger from '../utils/logger';

export class UserController {
  private userService: UserService;
  private authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const newUser = await this.authService.register(data);
      res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (error: any) {
      logger.error('Create User Error:', error.message);
      res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
  };

  findAll = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const users = await this.userService.findAll(limit, offset);
      res.status(200).json({ data: users });
    } catch (error: any) {
      logger.error('Find All Users Error:', error.message);
      res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const user = await this.userService.findById(id);
      res.status(200).json({ data: user });
    } catch (error: any) {
      logger.error('Find User By ID Error:', error.message);
      res.status(404).json({ message: 'User not found', error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const updatedUser = await this.userService.update(id, data);
      res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    } catch (error: any) {
      logger.error('Update User Error:', error.message);
      res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await this.userService.delete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      logger.error('Delete User Error:', error.message);
      res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
  };
}
