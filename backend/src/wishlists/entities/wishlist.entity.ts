import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUrl, Length, MaxLength } from 'class-validator';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @Length(1, 250)
  name: string;

  @Column({ length: 1500, nullable: true })
  @MaxLength(1500)
  description: string | null;

  @Column({ nullable: true })
  @IsUrl()
  image: string | null;

  @ManyToOne(() => User, (u) => u.wishlists, { eager: false })
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
