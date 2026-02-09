import { plainToInstance } from 'class-transformer';

import { User } from '../../users/entities/user.entity';
import { ResponsePublicUserDto } from '../../users/dto/response-public-user.dto';
import { ResponseUserDto } from '../../users/dto/response-user.dto';

export const toPublicResponseUser = (user: User): ResponsePublicUserDto =>
  plainToInstance(ResponsePublicUserDto, user, {
    excludeExtraneousValues: true,
  });

export const toPrivateResponseUser = (user: User): ResponseUserDto =>
  plainToInstance(ResponseUserDto, user, {
    excludeExtraneousValues: true,
  });
