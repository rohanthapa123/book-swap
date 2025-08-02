import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './Book';
import { Users } from './User';

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
  // ✅ Link to admin who approved/rejected it
  @ManyToOne(() => Users, { nullable: true })
  approvedBy?: Users;

  @CreateDateColumn()
  requestedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
