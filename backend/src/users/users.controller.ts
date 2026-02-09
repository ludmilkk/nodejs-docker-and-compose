import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { WishesService } from '../wishes/wishes.service';
import { UserRequest } from '../common/types/routes';
import {
  toPrivateResponseUser,
  toPublicResponseUser,
} from '../common/utils/user';
import { toPublicResponseWish } from '../common/utils/wish';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  async getMe(@Req() req: UserRequest) {
    const result = await this.usersService.findOneByUserId(req.user.id);
    return toPrivateResponseUser(result);
  }

  @Patch('me')
  async patchMe(@Req() req: UserRequest, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.updateUserInfo(
      req.user,
      updateUserDto,
    );
    return toPrivateResponseUser(result);
  }

  @Get('me/wishes')
  async getMeWishes(@Req() req: UserRequest) {
    const result = await this.wishesService.getWishesByUser(req.user);
    return result.map(toPublicResponseWish);
  }

  @Post('find')
  async findByQuery(@Body() findUsersDto: FindUsersDto) {
    const result = await this.usersService.findManyBySearchQuery(
      findUsersDto.query,
    );
    return result.map(toPublicResponseUser);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const result = await this.usersService.findOneByUsername(username);
    return toPublicResponseUser(result);
  }

  @Get(':username/wishes')
  async getUserWishes(
    @Req() req: UserRequest,
    @Param('username') username: string,
  ) {
    const result = await this.wishesService.getWishesByUsername(
      req.user,
      username,
    );
    return result.map(toPublicResponseWish);
  }
}
