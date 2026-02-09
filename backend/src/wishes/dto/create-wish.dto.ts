import { IsString, Length, IsUrl, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishDto {
  @IsString()
  @Length(1, 250, {
    message: 'Название не может быть короче 1 или длинее 250 символов',
  })
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0.01)
  price: number;

  @IsString()
  @Length(1, 1024, {
    message: 'Описание не может быть короче 1 или длинее 1024 символов',
  })
  description: string;
}
