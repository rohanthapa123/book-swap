import { Book } from '../entity/Book';
import { BookRepository } from '../repository/book.repository';

export class BookService {
  private bookRepo: BookRepository;

  constructor() {
    this.bookRepo = new BookRepository();
  }

  async findAll(limit: number, offset: number): Promise<Book[]> {
    return this.bookRepo.findAll(limit, offset);
  }
  async findPending(limit: number, offset: number): Promise<Book[]> {
    return this.bookRepo.findPending(limit, offset);
  }
  async findAllAuthenticate(limit: number, offset: number, userId: string): Promise<Book[]> {
    return this.bookRepo.findAllAuthenticate(userId, limit, offset);
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookRepo.findById(id);
    if (!book) throw new Error('Book not found');
    return book;
  }

  async findMy(id: string): Promise<Book[]> {
    const book = await this.bookRepo.findMy(id);
    if (!book) throw new Error('Book not found');
    return book;
  }

  async create(data: Partial<Book>): Promise<Book> {
    return this.bookRepo.create(data);
  }

  async update(id: string, data: Partial<Book>): Promise<Book> {
    const updatedBook = await this.bookRepo.update(id, data);
    if (!updatedBook) throw new Error('Book not found for update');
    return updatedBook;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.bookRepo.delete(id);
    if (!deleted) throw new Error('Book not found for deletion');
    return deleted;
  }

  async approve(id: string): Promise<{ message: string }> {
    const approved = await this.bookRepo.approve(id);
    if (!approved) throw new Error('Book not found for deletion');
    return approved;
  }
  async reject(id: string): Promise<{ message: string }> {
    const approved = await this.bookRepo.reject(id);
    if (!approved) throw new Error('Book not found for deletion');
    return approved;
  }
}
