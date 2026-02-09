import { ResponsePublicUserDto } from '../../users/dto/response-public-user.dto';
import { ResponseWishDto } from '../../wishes/dto/response-wish.dto';
import { Expose, Type } from 'class-transformer';

export class ResponseWishlistDto {
  @Expose() id: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() image?: string;
  @Expose() @Type(() => ResponsePublicUserDto) owner: ResponsePublicUserDto;
  @Expose() @Type(() => ResponseWishDto) items?: ResponseWishDto[];
}
