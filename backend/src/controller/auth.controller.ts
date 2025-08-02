import { Request, Response } from 'express';
import logger from '../utils/logger';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import bcrypt from "bcrypt"

export class AuthController {

  private userService = new UserService();
  private authService = new AuthService();

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.authService.validateCredential(email, password);

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // if (!user.admin) {
    //   res.status(403).json({ message: 'Not Authorized' });
    //   return;
    // }

    // Send token in cookie (more secure)
    if (req.session) {
      req.session.user = { id: user.id, name: user.name };

      // 🧼 Sanitize the user data
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        preferences: user.preferences,
      };

      res.status(200).json({ message: 'Login successful', data: safeUser });
      return;
    } else {
      throw new Error('Session is not initialized');
    }
  };


  register = async (req: Request, res: Response) => {
    try {
      const { email, name, password } = req.body;

      console.log(req.body)

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      let admin = email === 'nidhiisadmin@gmail.com';

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.authService.register({
        email,
        name,
        password: hashedPassword,
        admin,
      });

      res
        .status(201)
        .json({ message: 'User created successfully', data: newUser });
    } catch (error: any) {
      logger.error('Create Error:', error.message);
      res
        .status(500)
        .json({ message: 'Failed to create user', error: error.message });
    }
  };

  logout = async (_req: Request, res: Response) => {
    _req.session = null;
    res.status(200).json({ message: 'Logged out successfully' });
  };

  getme = async (req: Request, res: Response) => {
    console.log(req.session)
    if (req.session?.user) {
      console.log("therre is user also ?")
      const user = await this.userService.findById(req.session.user.id); // Assuming this exists
      res.status(200).json({ message: "Authenticated successfully", data: user });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  };

  getAllUsers = async (_req: Request, res: Response) => {
    try {
      const users = await this.userService.findAll(1000, 0);
      res.status(200).json({ data: users });
    } catch (error: any) {
      logger.error('Get All Users Error:', error.message);
      res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
  }

}
