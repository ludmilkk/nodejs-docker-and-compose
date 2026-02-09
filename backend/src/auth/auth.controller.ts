import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResponseSigninDto } from './dto/response-signin.dto';
import { UserRequest } from '../common/types/routes';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseSigninDto> {
    const user = await this.auth.register(createUserDto);
    if (user) return this.auth.authorize(user);
    return null;
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signIn(@Req() req: UserRequest): Promise<ResponseSigninDto> {
    return this.auth.authorize(req.user);
  }
}
