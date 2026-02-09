import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString, IsUrl, Length, MinLength } from 'class-validator';

import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true, length: 30 })
  @Length(2, 30)
  @Index()
  username: string;

  @Column({ unique: true })
  @IsEmail()
  @Index()
  email: string;

  @Column({ length: 200, default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  @MinLength(3)
  @IsString()
  password: string;

  @OneToMany(() => Wish, (w) => w.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (o) => o.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (l) => l.owner)
  wishlists: Wishlist[];
}
