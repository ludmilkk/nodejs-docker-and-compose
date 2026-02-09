import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { to2Digits } from '../common/utils/numbers';
import { CrudOptions, QueryFilter } from '../common/types/crud';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import {
  toPublicResponseOffer,
  toPrivateResponseOffer,
} from '../common/utils/offer';
import { ResponseOfferDto } from './dto/response-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  processOffer(offer: Offer, requestedBy: User): ResponseOfferDto {
    const isOwner = offer.item?.owner?.id === requestedBy.id;
    const isGiver = offer.user?.id === requestedBy.id;
    const hidden = offer.hidden;

    if (hidden && !isOwner && !isGiver) return null;
    if (!isOwner && !isGiver) return toPublicResponseOffer(offer);
    return toPrivateResponseOffer(offer);
  }

  async create(owner: User, createOfferDto: CreateOfferDto) {
    const amount = to2Digits(createOfferDto.amount);

    const saved = await this.offerRepository.manager.transaction(
      async (manager) => {
        const _wishRepository = manager.getRepository(Wish);
        const _offerRepository = manager.getRepository(Offer);

        const wishCheck = await _wishRepository.findOne({
          where: { id: createOfferDto.itemId },
          relations: ['owner'],
        });
        if (!wishCheck) throw new NotFoundException('Подарок не найден');
        if (wishCheck.owner.id === owner.id) {
          throw new ForbiddenException('Нельзя собирать на свои подарки!');
        }

        const wish = await _wishRepository.findOne({
          where: { id: createOfferDto.itemId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!wish) throw new NotFoundException('Подарок не найден');

        const remaning = to2Digits(wish.price - wish.raised);
        if (remaning <= 0) {
          throw new ConflictException('На подарок уже собрана вся сумма!');
        }
        if (amount > remaning) {
          throw new ConflictException(
            `Сумма больше, чем осталось собрать (${remaning})!`,
          );
        }

        const offer = _offerRepository.create({
          amount,
          hidden: createOfferDto.hidden,
          user: owner,
          item: wish,
        });
        const saved = await _offerRepository.save(offer);

        await _wishRepository.update(
          { id: wish.id },
          { raised: to2Digits(wish.raised + amount) },
        );

        return saved;
      },
    );

    return this.findOne(
      { id: saved.id },
      { relations: { user: true, item: { owner: true } } },
    );
  }

  async findOne(where: QueryFilter<Offer>, options: CrudOptions<Offer> = {}) {
    const { relations, select } = options;
    return this.offerRepository.findOne({
      where,
      relations,
      select,
    });
  }

  async findMany(where?: QueryFilter<Offer>, options: CrudOptions<Offer> = {}) {
    const { relations, select } = options;
    return this.offerRepository.find({
      where,
      relations,
      select,
    });
  }

  async updateOne(where: QueryFilter<Offer>, toUpdate: Partial<Offer>) {
    const offer = await this.offerRepository.findOne({ where });
    if (!offer) throw new NotFoundException('Список не найден');
    if (toUpdate.amount && toUpdate.amount !== offer.amount) {
      toUpdate.amount = to2Digits(toUpdate.amount);
    }
    Object.assign(offer, toUpdate);
    return this.offerRepository.save(offer);
  }

  async removeOne(where: QueryFilter<Offer>) {
    const offer = await this.offerRepository.findOne({ where });
    if (!offer) throw new NotFoundException('Список не найден');
    await this.offerRepository.remove(offer);
    return offer;
  }

  async findManyWithUser(user: User) {
    const list = await this.findMany(
      {},
      { relations: { user: true, item: { owner: true } } },
    );
    return list.map((offer) => this.processOffer(offer, user)).filter(Boolean);
  }

  async findOneWithUser(user: User, id: number) {
    const offer = await this.findOne(
      { id },
      { relations: { user: true, item: { owner: true } } },
    );
    if (!offer) throw new NotFoundException('Заявка не найдена');
    return this.processOffer(offer, user);
  }
}
