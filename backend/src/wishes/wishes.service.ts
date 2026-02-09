import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { to2Digits } from '../common/utils/numbers';
import { CrudOptions, QueryFilter } from '../common/types/crud';
import { User } from '../users/entities/user.entity';
import { filterOffersForUser } from '../common/utils/wish';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto) {
    const newWish = this.wishRepository.create({
      ...createWishDto,
      price: to2Digits(createWishDto.price),
      raised: 0,
      owner: owner,
    });
    return this.wishRepository.save(newWish);
  }

  async findOne(where: QueryFilter<Wish>, options: CrudOptions<Wish> = {}) {
    const { relations, select } = options;
    return this.wishRepository.findOne({
      where,
      relations,
      select,
    });
  }

  async findMany(where?: QueryFilter<Wish>, options: CrudOptions<Wish> = {}) {
    const { relations, order, select } = options;
    return this.wishRepository.find({
      where,
      relations,
      select,
      order: order ?? { createdAt: 'DESC' },
    });
  }

  async updateOne(where: QueryFilter<Wish>, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(where, {
      relations: { owner: true, offers: true },
    });
    if (!wish) return null;
    Object.assign(wish, updateWishDto);
    return this.wishRepository.save(wish);
  }

  async removeOne(where: QueryFilter<Wish>) {
    const wish = await this.findOne(where, {
      relations: { owner: true, offers: { user: true } },
    });
    if (!wish) return null;
    await this.wishRepository.remove(wish);
    return wish;
  }

  async updateById(
    requestedBy: User,
    id: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.findOne(
      { id },
      {
        relations: { owner: true, offers: true },
      },
    );
    if (!wish) throw new NotFoundException('Подарок не найден');

    if (wish.owner.id !== requestedBy.id) {
      throw new ForbiddenException('Нельзя редактировать чужие подарки!');
    }

    if (
      updateWishDto.price &&
      updateWishDto.price !== wish.price &&
      wish.offers.length
    ) {
      throw new ForbiddenException(
        'Нельзя изменить стоимость, поскольку кто-то уже внес деньги',
      );
    }

    if (updateWishDto.price && updateWishDto.price != 0) {
      updateWishDto.price = to2Digits(updateWishDto.price);
    }

    return await this.updateOne({ id: wish.id }, updateWishDto);
  }

  async removeById(requestedBy: User, id: number) {
    const row = await this.findOne(
      { id },
      {
        relations: { owner: true, offers: true },
      },
    );
    if (!row) throw new NotFoundException('Подарок не найден');

    if (row.owner.id !== requestedBy.id) {
      throw new ForbiddenException('Нельзя удалять чужие подарки!');
    }

    if (row.offers.length) {
      throw new ForbiddenException(
        'Нельзя удалить, поскольку кто-то уже внес деньги',
      );
    }

    return await this.removeOne({ id: row.id });
  }

  async findTop(limit = 20) {
    return await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: limit,
      relations: ['owner'],
    });
  }

  async findLast(limit = 40) {
    return await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['owner'],
    });
  }

  async copyWish(requestedBy: User, id: number) {
    const from = await this.findOne(
      { id },
      {
        relations: { owner: true, offers: { user: true } },
      },
    );
    if (!from) throw new NotFoundException('Подарок не найден');
    if (from.owner.id === requestedBy.id)
      throw new ForbiddenException('Нельзя копировать собственные подарки');

    await this.wishRepository.update(
      { id },
      { copied: (from.copied ?? 0) + 1 },
    );
    const copy = this.wishRepository.create({
      name: from.name,
      link: from.link,
      image: from.image,
      price: from.price,
      raised: 0,
      description: from.description,
      owner: requestedBy,
    });
    return this.wishRepository.save(copy);
  }

  async findOneById(requestedBy: User, id: number) {
    const wish = await this.findOne(
      { id },
      {
        relations: { owner: true, offers: { user: true } },
      },
    );
    if (!wish) throw new NotFoundException('Подарок не найден');

    filterOffersForUser(wish, requestedBy);
    return wish;
  }

  async getWishesByUser(requestedBy: User) {
    const wishes = await this.findMany(
      { owner: { id: requestedBy.id } },
      {
        relations: {
          owner: true,
          offers: { user: true },
        },
      },
    );
    for (const wish of wishes) filterOffersForUser(wish, requestedBy);
    return wishes;
  }

  async getWishesByUsername(requestedBy: User, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const wishes = await this.findMany(
      { owner: { id: user.id } },
      {
        relations: {
          owner: true,
          offers: { user: true },
        },
      },
    );
    for (const wish of wishes) filterOffersForUser(wish, user);
    return wishes;
  }

  async getWishesByIds(itemsId?: number[], requestedBy: User | null = null) {
    const uniqueIds = itemsId?.length ? Array.from(new Set(itemsId)) : [];
    if (!uniqueIds.length) return [];

    const where: FindOptionsWhere<Wish> = requestedBy
      ? { id: In(uniqueIds), owner: { id: requestedBy.id } }
      : { id: In(uniqueIds) };

    return this.findMany(where, {
      relations: {
        owner: true,
        offers: { user: true },
      },
    });
  }
}
