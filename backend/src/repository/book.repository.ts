import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Book } from '../entity/Book';
import { BookApprovalRequest } from '../entity/BookApprovalRequest';

export class BookRepository {
    private repo: Repository<Book>;
    private approvalRepo: Repository<BookApprovalRequest>;

    constructor() {
        this.repo = AppDataSource.getRepository(Book);
        this.approvalRepo = AppDataSource.getRepository(BookApprovalRequest);
    }

    async findAll(limit: number, offset: number): Promise<Book[]> {
        return this.repo
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.owner', 'owner')
            .leftJoinAndMapOne(
                'book.approvalRequest',
                BookApprovalRequest,
                'approval',
                'approval.bookId = book.id'
            )
            .take(limit)
            .skip(offset)
            .getMany();
    }


    async findPending(limit: number, offset: number): Promise<Book[]> {
        return this.repo
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.owner', 'owner')
            .leftJoinAndMapOne(
                'book.approvalRequest',
                BookApprovalRequest,
                'approval',
                'approval.bookId = book.id'
            )
            .take(limit)
            .skip(offset)
            .where('approval.status = :status', { status: 'pending' })
            .orWhere('approval.status IS NULL') // Include books without approval
            .getMany();
    }

    async findAllAuthenticate(userId: string, limit: number, offset: number): Promise<Book[]> {
        return this.repo
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.owner', 'owner')
            .leftJoinAndMapOne(
                'book.approvalRequest',
                BookApprovalRequest,
                'approval',
                'approval.bookId = book.id'
            )
            .where('owner.id != :userId', { userId })
            .take(limit)
            .skip(offset)
            .getMany();
    }

    async findEvery() {
        return this.repo.find({ relations: ['owner'] });
    }

    async create(data: Partial<Book>) {
        const book = this.repo.create(data);
        book.approvalRequest = new BookApprovalRequest(); // Initialize approval request
        book.approvalRequest.status = 'pending'; // Set default status
        return await this.repo.save(book);
    }

    // async findById(id: string) {
    //     return this.repo
    //         .createQueryBuilder('book')
    //         .leftJoinAndSelect('book.owner', 'owner')
    //         .leftJoinAndMapOne(
    //             'book.approvalRequest',
    //             BookApprovalRequest,
    //             'approval',
    //             'approval.bookId = book.id'
    //         )
    //         .where('book.id = :id', { id })
    //         .getOne();
    // }

    async findById(id: string) {
        return this.repo.findOne({
            where: { id },
            relations: ['owner', 'approvalRequest'],
        });
    }

    // async findMy(id: string) {
    //     return this.repo
    //         .createQueryBuilder('book')
    //         .leftJoinAndSelect('book.owner', 'owner')
    //         .leftJoinAndMapOne(
    //             'book.approvalRequest',
    //             BookApprovalRequest,
    //             'approval',
    //             'approval.bookId = book.id'
    //         )
    //         .where('owner.id = :id', { id })
    //         .getMany();
    // }

    async findMy(id: string) {
        return this.repo.find({
            where: { owner: { id } },
            relations: ['owner', 'approvalRequest'],
        });
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

    async approve(id: string) {
        const book = await this.repo.findOne({
            where: { id },
            relations: ['approvalRequest'],
        });


        console.log(book, "befoer approveal")

        if (!book || !book.approvalRequest) return null;


        book.approvalRequest.status = 'approved';

        console.log(book, "after approveal")
        await this.repo.save(book); // Will not save the related entity unless cascade is set
        await this.approvalRepo.save(book.approvalRequest);

        return { message: 'Book approved successfully' };
    }

    async reject(id: string) {
        const book = await this.repo.findOne({
            where: { id },
            relations: ['approvalRequest'],
        });

        if (!book || !book.approvalRequest) return null;

        book.approvalRequest.status = 'rejected';
        await this.repo.save(book); // Same note on cascading
        await this.approvalRepo.save(book.approvalRequest);

        return { message: 'Book rejected successfully' };
    }

}
