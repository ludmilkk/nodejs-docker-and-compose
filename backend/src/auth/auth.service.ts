import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { validatePassword } from '../common/helpers/security';
import { ResponseSigninDto } from './dto/response-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async validate(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return null;
    return await validatePassword(password, user as User);
  }

  async authorize(user: User): Promise<ResponseSigninDto> {
    const payload = { sub: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
