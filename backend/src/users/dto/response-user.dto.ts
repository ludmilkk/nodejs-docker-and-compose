import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose() id: number;
  @Expose() username: string;
  @Expose() email: string;
  @Expose() about: string;
  @Expose() avatar: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
