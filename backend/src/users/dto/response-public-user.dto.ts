import { Expose } from 'class-transformer';

export class ResponsePublicUserDto {
  @Expose() id: number;
  @Expose() username: string;
  @Expose() about: string;
  @Expose() avatar: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
