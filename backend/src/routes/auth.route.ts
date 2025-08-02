import express from 'express';
import { AuthController } from '../controller/auth.controller';
import { adminAuthenticate, authenticate } from '../middlewares/authMiddleware';

const controller = new AuthController();

const router = express.Router();

router.get('/get-me', authenticate, controller.getme);
router.get('/user', adminAuthenticate, controller.getAllUsers);
router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/logout', controller.logout);

export { router as authRouter };
