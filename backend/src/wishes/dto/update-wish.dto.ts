import { IsNumber, IsOptional, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsOptionalString,
  IsOptionalURL,
} from '../../common/decorators/optional-fields.decorator';

export class UpdateWishDto {
  @IsOptionalString()
  @Length(1, 250, {
    message: 'Название не может быть короче 1 или длинее 250 символов',
  })
  name?: string;

  @IsOptionalURL()
  link?: string;

  @IsOptionalURL()
  image?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  price?: number;

  @IsOptionalString()
  @Length(1, 1024, {
    message: 'Описание не может быть короче 1 или длинее 1024 символов',
  })
  description?: string;
}
