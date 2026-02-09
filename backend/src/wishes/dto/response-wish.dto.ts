import { ResponsePublicUserDto } from '../../users/dto/response-public-user.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseOfferDto } from '../../offers/dto/response-offer.dto';

export class ResponseWishDto {
  @Expose() id: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() name: string;
  @Expose() link: string;
  @Expose() image: string;
  @Expose() price: number;
  @Expose() raised: number;
  @Expose() @Type(() => ResponsePublicUserDto) owner: ResponsePublicUserDto;
  @Expose() description: string;
  @Expose() @Type(() => ResponseOfferDto) offers: ResponseOfferDto[];
  @Expose() copied: number;
}
