import { Expose, Type } from 'class-transformer';

import { ResponsePublicUserDto } from '../../users/dto/response-public-user.dto';
import { ResponseWishDto } from '../../wishes/dto/response-wish.dto';

export class ResponseOfferDto {
  @Expose() id: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() @Type(() => ResponsePublicUserDto) user: ResponsePublicUserDto;
  @Expose() @Type(() => ResponseWishDto) item: ResponseWishDto;
  @Expose() amount: number;
  @Expose() hidden: boolean;
  @Expose() name: string;
}
