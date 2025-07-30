import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";

@Entity()
export class BookApprovalRequest {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => Book, (book) => book.approvalRequest)
    @JoinColumn()
    book!: Book;


    @Column({ default: 'pending' })
    status!: 'pending' | 'approved' | 'rejected';

    @Column({ nullable: true, type: 'text' })
    adminNote?: string;

    @Column()
    requestedAt!: Date;

    @BeforeInsert()
    setRequestedAt() {
        this.requestedAt = new Date();
    }
}
