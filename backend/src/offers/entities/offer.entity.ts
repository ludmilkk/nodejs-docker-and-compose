import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { decimalStringTransformer } from '../../common/transformers/decimal-db.transformer';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers, { eager: false })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, { eager: false })
  item: Wish;

  @Column({
    type: 'decimal',
    scale: 2,
    transformer: decimalStringTransformer,
  })
  amount: number;

  @Column({ type: 'boolean', default: false })
  hidden: boolean;
}
