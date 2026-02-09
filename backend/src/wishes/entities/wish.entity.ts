import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { IsInt, IsUrl, Length } from 'class-validator';

import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { decimalStringTransformer } from '../../common/transformers/decimal-db.transformer';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @Length(1, 250)
  @Index()
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'decimal',
    scale: 2,
    transformer: decimalStringTransformer,
  })
  price: number;

  @Column({
    type: 'decimal',
    scale: 2,
    default: 0,
    transformer: decimalStringTransformer,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes, { eager: false })
  owner: User;

  @Column({ length: 1024 })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsInt()
  copied: number;
}
