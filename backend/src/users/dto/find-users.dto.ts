import { IsString, Length } from 'class-validator';

export class FindUsersDto {
  @IsString()
  @Length(1, 100, {
    message:
      'Поисковый запрос должен содержать хотя бы 1 символ и не быть длинее 100',
  })
  query: string;
}
