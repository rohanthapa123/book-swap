import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
} from 'typeorm';
import { Users } from './User';
import { BookApprovalRequest } from './BookApprovalRequest';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  isbn!: string;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  desc!: string;

  @Column({ nullable: true })
  genre?: string;

  @Column({ nullable: true })
  condition?: string;

  @Column({ nullable: true })
  language?: string;

  @Column({ nullable: true })
  publishedYear?: string;

  @Column({ nullable: true })
  noOfPages?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ default: true })
  isAvailable!: boolean;

  @ManyToOne(() => Users, (user) => user.books)
  owner!: Users;

  @OneToOne(() => BookApprovalRequest, (approval) => approval.book)
  approvalRequest!: BookApprovalRequest;


  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @BeforeInsert()
  setCreationDate() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updatedAt = new Date();
  }
}
