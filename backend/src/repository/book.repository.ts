import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Book } from '../entity/Book';
import { BookApprovalRequest } from '../entity/BookApprovalRequest';

export class BookRepository {
    private repo: Repository<Book>;

    constructor() {
        this.repo = AppDataSource.getRepository(Book);
    }

    async findAll() {
        return this.repo
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.owner', 'owner')
            .leftJoinAndMapOne(
                'book.approvalRequest',
                BookApprovalRequest,
                'approval',
                'approval.bookId = book.id'
            )
            .getMany();
    }

    async findEvery() {
        return this.repo.find({ relations: ['owner'] });
    }

    async create(data: Partial<Book>) {
        const book = this.repo.create(data);
        return await this.repo.save(book);
    }

    async findById(id: string) {
        return this.repo
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.owner', 'owner')
            .leftJoinAndMapOne(
                'book.approvalRequest',
                BookApprovalRequest,
                'approval',
                'approval.bookId = book.id'
            )
            .where('book.id = :id', { id })
            .getOne();
    }

    async findMy(id: string) {
        return this.repo
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.owner', 'owner')
            .leftJoinAndMapOne(
                'book.approvalRequest',
                BookApprovalRequest,
                'approval',
                'approval.bookId = book.id'
            )
            .where('owner.id = :id', { id })
            .getMany();
    }


    async update(id: string, data: Partial<Book>) {
        const book = await this.repo.findOneBy({ id });
        if (!book) return null;

        this.repo.merge(book, data);
        return await this.repo.save(book);
    }

    async delete(id: string) {
        const book = await this.repo.findOneBy({ id });
        if (!book) return null;

        await this.repo.remove(book);
        return { message: 'Book deleted successfully' };
    }
}
