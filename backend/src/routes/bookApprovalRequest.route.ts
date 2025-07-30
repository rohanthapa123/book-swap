import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { BookApprovalRequestController } from '../controller/bookApprovalRequest.controller';

const controller = new BookApprovalRequestController();
const router = express.Router();

// 📥 Submit book approval request (authenticated)
router.post('/', authenticate, controller.create);

// 🕒 Get all pending book requests (admin)
router.get('/pending', authenticate, controller.findPending);

// 🔄 Approve or reject book request
router.put('/:id/status', authenticate, controller.updateStatus);

// 🔍 Find request by book ID
router.get('/book/:bookId', authenticate, controller.findByBookId);

export { router as bookApprovalRequestRouter };
