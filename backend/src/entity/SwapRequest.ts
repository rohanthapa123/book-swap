import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
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

  @OneToMany(() => SwapRequest, swap => swap.bookOffered)
  swapsOffered?: SwapRequest[];

  @OneToMany(() => SwapRequest, swap => swap.bookRequested)
  swapsRequested?: SwapRequest[];


  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}
