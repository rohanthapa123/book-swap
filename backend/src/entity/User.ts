import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PreferenceType } from '../types/types';
import { SwapRequest } from './SwapRequest';
import { Book } from './Book';


@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  admin!: boolean;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  gender?: 'male' | 'female' | 'other';

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isVerified!: boolean;

  @OneToMany(() => Book, (book) => book.owner)
  books?: Book[];

  @OneToMany(() => SwapRequest, (swap) => swap.requester)
  swapRequestsSent?: SwapRequest[];

  @OneToMany(() => SwapRequest, (swap) => swap.receiver)
  swapRequestsReceived?: SwapRequest[];

  @Column({ type: 'simple-array', nullable: true })
  preferences: PreferenceType[] | null = null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude?: number;

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
