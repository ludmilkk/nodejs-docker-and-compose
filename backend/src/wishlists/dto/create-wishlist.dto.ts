import { IsArray, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsOptionalString,
  IsOptionalURL,
} from '../../common/decorators/optional-fields.decorator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250, {
    message: 'Название должно быть не короче 1 и не длинее 250 символов',
  })
  name: string;

  @IsOptionalString()
  @Length(0, 1500, { message: 'Описание не может превышать 1500 символов' })
  description?: string;

  @IsOptionalURL()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  itemsId?: number[];
}
