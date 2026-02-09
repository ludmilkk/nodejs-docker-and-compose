import { plainToInstance } from 'class-transformer';

import { ResponseWishDto } from '../../wishes/dto/response-wish.dto';
import { Wish } from '../../wishes/entities/wish.entity';
import { toPublicResponseUser } from './user';
import { User } from '../../users/entities/user.entity';
import { toPublicResponseOffer } from './offer';

export const toPublicResponseWish = (wish: Wish): ResponseWishDto =>
  plainToInstance(
    ResponseWishDto,
    {
      ...wish,
      owner: wish.owner ? toPublicResponseUser(wish.owner) : null,
      offers: (wish.offers ?? []).map(toPublicResponseOffer),
    },
    { excludeExtraneousValues: true },
  );

export function filterOffersForUser(wish: Wish, requestedBy: User): void {
  const isOwner = wish.owner?.id === requestedBy.id;
  wish.offers = (wish.offers ?? []).filter(
    (offer) => isOwner || !offer.hidden || offer.user?.id === requestedBy.id,
  );
}
