import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { UserController } from '../controller/user.controller';

const controller = new UserController();

const router = express.Router();

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.delete('/:id', authenticate, controller.delete);
router.put('/:id', controller.update);

export { router as userRouter };
