import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { CrudOptions, QueryFilter } from '../common/types/crud';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(owner: User, createWishlistDto: CreateWishlistDto) {
    const items = await this.wishesService.getWishesByIds(
      createWishlistDto.itemsId,
      owner,
    );

    const newWishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: owner,
      items,
    });
    return this.wishlistRepository.save(newWishlist);
  }

  async findOne(
    where: QueryFilter<Wishlist>,
    options: CrudOptions<Wishlist> = {},
  ) {
    const { relations, select } = options;
    return await this.wishlistRepository.findOne({
      where,
      relations,
      select,
    });
  }

  async findMany(
    where?: QueryFilter<Wishlist>,
    options: CrudOptions<Wishlist> = {},
  ) {
    const { relations, select } = options;
    return await this.wishlistRepository.find({
      where,
      relations,
      select,
    });
  }

  async updateOne(
    where: QueryFilter<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
    requestedBy: User | null = null,
  ) {
    const wishlist = await this.findOne(where, { relations: { items: true } });
    if (!wishlist) throw new NotFoundException('Список не найден!');

    if (updateWishlistDto.itemsId) {
      wishlist.items = await this.wishesService.getWishesByIds(
        updateWishlistDto.itemsId,
        requestedBy,
      );
      delete updateWishlistDto.itemsId;
    }
    Object.assign(wishlist, updateWishlistDto);
    return this.wishlistRepository.save(wishlist);
  }

  async removeOne(where: QueryFilter<Wishlist>) {
    const wishlist = await this.findOne(where, {
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) throw new NotFoundException('Список не найден!');
    await this.wishlistRepository.remove(wishlist);
    return wishlist;
  }

  async findOneById(id: number) {
    return await this.findOne(
      { id },
      {
        relations: {
          owner: true,
          items: true,
        },
      },
    );
  }

  async updateByUserAndId(
    user: User,
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wishlist || !wishlist.owner || wishlist.owner.id !== user.id)
      throw new ForbiddenException(
        'Изменить можно только созданный вами список',
      );

    return this.updateOne({ id }, updateWishlistDto, user);
  }

  async removeByUserAndId(user: User, id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });
    if (!wishlist) throw new NotFoundException('Список не найден');
    if (!wishlist.owner || wishlist.owner.id !== user.id)
      throw new ForbiddenException(
        'Удалить можно только созданный вами список',
      );

    return this.removeOne({ id });
  }

  async findAll() {
    return this.findMany(
      {},
      {
        relations: {
          owner: true,
          items: true,
        },
      },
    );
  }
}
