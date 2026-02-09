import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UserRequest } from '../common/types/routes';
import { toPublicResponseWish } from '../common/utils/wish';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async postWishes(
    @Req() req: UserRequest,
    @Body() createWishDto: CreateWishDto,
  ) {
    const result = await this.wishesService.create(req.user, createWishDto);
    return toPublicResponseWish(result);
  }

  @Get('top')
  async getTop() {
    const top = await this.wishesService.findTop(20);
    return top.map(toPublicResponseWish);
  }

  @Get('last')
  async getLast() {
    const last = await this.wishesService.findLast(40);
    return last.map(toPublicResponseWish);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id(\\d+)/copy')
  async postCopy(
    @Req() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.wishesService.copyWish(req.user, id);
    return toPublicResponseWish(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id(\\d+)')
  async getById(
    @Req() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.wishesService.findOneById(req.user, id);
    return toPublicResponseWish(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id(\\d+)')
  async patchById(
    @Req() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWishDto,
  ) {
    const result = await this.wishesService.updateById(req.user, id, dto);
    return toPublicResponseWish(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id(\\d+)')
  async removeById(
    @Req() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.wishesService.removeById(req.user, id);
    return toPublicResponseWish(result);
  }
}
