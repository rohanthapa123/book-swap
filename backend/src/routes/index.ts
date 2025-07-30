import express from 'express';
import { authRouter } from './auth.route';
import { bookApprovalRequestRouter } from './bookApprovalRequest.route';
import { bookRouter } from './book.route';
import { recommendationRouter } from './recommendation.route';
import { swapRequestRouter } from './swapRequest.route';
import { userRouter } from './user.route';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/books',  bookRouter);
router.use('/swap-requests', swapRequestRouter);
router.use('/book-requests', bookApprovalRequestRouter);
router.use('/recommendation', recommendationRouter);

export { router as indexRouter };
