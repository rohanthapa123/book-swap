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

// ✅ Update status (approve/reject by admin)
router.put('/:id/status', authenticate, controller.update);

// ❌ Delete a request
router.delete('/:id', authenticate, controller.delete);

export { router as swapRequestRouter };
