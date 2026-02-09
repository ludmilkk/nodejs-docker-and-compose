import { plainToInstance } from 'class-transformer';

import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { ResponseWishlistDto } from '../../wishlists/dto/response-wishlist.dto';
import { toPublicResponseUser } from './user';
import { toPublicResponseWish } from './wish';

export const toPublicResponseWishlist = (
  wishlist: Wishlist,
): ResponseWishlistDto =>
  plainToInstance(
    ResponseWishlistDto,
    {
      ...wishlist,
      owner: wishlist.owner ? toPublicResponseUser(wishlist.owner) : null,
      items: (wishlist.items ?? []).map(toPublicResponseWish),
    },
    { excludeExtraneousValues: true },
  );
