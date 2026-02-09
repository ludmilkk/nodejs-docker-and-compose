import { IsEmail, IsString, Length, MinLength } from 'class-validator';
import {
  IsOptionalString,
  IsOptionalURL,
} from '../../common/decorators/optional-fields.decorator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30, {
    message: 'Допустимая длина имени пользователя от 2 до 30 символов',
  })
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3, { message: 'Пароль не может быть короче 3-х символов' })
  password: string;

  @IsOptionalString()
  @Length(2, 200, { message: 'Допустимая длина описания от 2 до 200 символов' })
  about?: string;

  @IsOptionalURL()
  avatar?: string;
}
