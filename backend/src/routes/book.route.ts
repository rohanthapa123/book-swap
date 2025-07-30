import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { BookController } from '../controller/book.controller';
import upload from '../utils/multer';
import fileUrlMiddleware from '../middlewares/fileUrlMiddleware';

const controller = new BookController();

const router = express.Router();

// 📚 Publicly fetch all books
router.get('/', controller.findAll);

// 📝 Create a new book (authenticated users only)
router.post('/', authenticate, upload.single("image"), fileUrlMiddleware("image", false), authenticate, controller.create);

// 🔍 Get a specific book by ID
router.get('/mine', authenticate, controller.findMy);
router.get('/:id', controller.findById);

// ✏️ Update a book
router.put('/:id', authenticate, upload.single("image"), fileUrlMiddleware("image", false), authenticate, controller.update);

// ❌ Delete a book
router.delete('/:id', authenticate, controller.delete);


export { router as bookRouter };
