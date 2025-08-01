import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { SwapRequestController } from '../controller/swapRequest.controller';

const controller = new SwapRequestController();
const router = express.Router();

// 📥 Create a swap request (authenticated user)
router.post('/', authenticate, controller.create);

// 📄 Get all swap requests (admin or user)
router.get('/', authenticate, controller.findAll);

// 🔍 Get one by ID
router.get('/:id', authenticate, controller.findById);

// ✅ Approve / accept a request (typically admin or recipient)
router.post('/:id/accept', authenticate, controller.accept);

// ❌ Reject a request (typically admin or recipient)
router.post('/:id/reject', authenticate, controller.reject);

// ↩️ Cancel / withdraw (typically the requester themselves)
router.post('/:id/cancel', authenticate, controller.cancel);

// 🔧 Generic status update (can be kept if you need flexible status setting)
router.patch('/:id/status', authenticate, controller.update);

// 🗑️ Delete a request
router.delete('/:id', authenticate, controller.delete);

export { router as swapRequestRouter };
