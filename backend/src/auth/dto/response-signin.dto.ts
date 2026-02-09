import { Expose } from 'class-transformer';

export class ResponseSigninDto {
  @Expose() access_token: string;
}
