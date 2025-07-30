import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import logger from '../utils/logger';
import { UserService } from '../services/user.service';
import { BookApprovalRequestService } from '../services/bookApprovalRequest.service';

export class BookController {
    private bookService: BookService;
    private userService: UserService;
    private bookApprovalService: BookApprovalRequestService;

    constructor() {
        this.bookService = new BookService();
        this.userService = new UserService();
        this.bookApprovalService = new BookApprovalRequestService();
    }
    create = async (req: Request, res: Response) => {
        try {
            const data = req.body;

            const userId = (req as any)?.user?.id;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized: User not found' });
                return;
            }

            // Find the user (owner of the book)
            const user = await this.userService.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Step 1: Create new Book instance
            const book = await this.bookService.create({
                ...data,
                owner: user,
            });


            // Step 3: Create a BookApprovalRequest
            const approvalRequest = this.bookApprovalService.create({
                book,
                status: 'pending', // default value, can be omitted
            });


            res.status(201).json({
                message: 'Book created successfully and pending approval',
                data: book,
                approvalRequest
            });
        } catch (error: any) {
            logger.error('Create Book Error:', error.message);
            res.status(500).json({ message: 'Failed to create book', error: error.message });
        }
    };


    // Get all books with pagination
    findAll = async (req: Request, res: Response) => {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;

        try {
            const books = await this.bookService.findAll(limit, offset);

            res.status(200).json({ data: books });
        } catch (error: any) {
            logger.error('Find All Books Error:', error.message);
            res.status(500).json({ message: 'Failed to retrieve books', error: error.message });
        }
    };

    // Get book by ID
    findById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const book = await this.bookService.findById(id);
            res.status(200).json({ data: book });
        } catch (error: any) {
            logger.error('Find Book By ID Error:', error.message);
            res.status(404).json({ message: 'Book not found', error: error.message });
        }
    };

    // Get book by ID
    findMy = async (req: Request, res: Response) => {
        try {
            const id = req.session?.user?.id;
            if (!id) {
                res.status(401).send({ message: "Unauthorized" });
                return;
            }
            const book = await this.bookService.findMy(id);
            res.status(200).json({ data: book });
        } catch (error: any) {
            logger.error('Find Book By ID Error:', error.message);
            res.status(404).json({ message: 'Book not found', error: error.message });
        }
    };

    // Update book by ID
    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const updatedBook = await this.bookService.update(id, data);
            res.status(200).json({ message: 'Book updated successfully', data: updatedBook });
        } catch (error: any) {
            logger.error('Update Book Error:', error.message);
            res.status(500).json({ message: 'Failed to update book', error: error.message });
        }
    };

    // Delete book by ID
    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            await this.bookService.delete(id);
            res.status(200).json({ message: 'Book deleted successfully' });
        } catch (error: any) {
            logger.error('Delete Book Error:', error.message);
            res.status(500).json({ message: 'Failed to delete book', error: error.message });
        }
    };
}
