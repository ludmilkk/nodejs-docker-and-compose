import { plainToInstance } from 'class-transformer';

import { toPublicResponseUser } from './user';
import { toPublicResponseWish } from './wish';
import { ResponseOfferDto } from '../../offers/dto/response-offer.dto';
import { Offer } from '../../offers/entities/offer.entity';

export const toPublicResponseOffer = (offer: Offer): ResponseOfferDto =>
  plainToInstance(ResponseOfferDto, {
    ...offer,
    user: offer.user ? toPublicResponseUser(offer.user) : undefined,
    item: offer.item ? toPublicResponseWish(offer.item) : undefined,
    name: offer.user ? offer.user.username : '',
  });

export const toPrivateResponseOffer = (offer: Offer): ResponseOfferDto =>
  plainToInstance(
    ResponseOfferDto,
    {
      ...offer,
      name: offer.user ? offer.user.username : '',
    },
    { excludeExtraneousValues: true },
  );
