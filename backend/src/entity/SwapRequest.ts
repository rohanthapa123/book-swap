import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Book } from './Book';
import { Users } from './User';

@Entity()
export class SwapRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Users, (user) => user.swapRequestsSent)
  requester!: Users;

  @ManyToOne(() => Users, (user) => user.swapRequestsReceived)
  receiver!: Users;

  @ManyToOne(() => Book)
  bookOffered!: Book;

  @ManyToOne(() => Book)
  bookRequested!: Book;

  @Column({ default: 'pending' })
  status!: 'pending' | 'accepted' | 'rejected' | 'cancelled';

  @Column()
  message!: string;

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
