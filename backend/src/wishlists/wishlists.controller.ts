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

import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { UserRequest } from '../common/types/routes';
import { toPublicResponseWishlist } from '../common/utils/wishlist';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async getAll() {
    const result = await this.wishlistsService.findAll();
    return result.map(toPublicResponseWishlist);
  }

  @Post()
  async postWishlist(
    @Req() req: UserRequest,
    @Body() createWishlist: CreateWishlistDto,
  ) {
    const result = await this.wishlistsService.create(req.user, createWishlist);
    return toPublicResponseWishlist(result);
  }

  @Get(':id(\\d+)')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.wishlistsService.findOneById(id);
    return toPublicResponseWishlist(result);
  }

  @Patch(':id(\\d+)')
  async patchById(
    @Req() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const result = await this.wishlistsService.updateByUserAndId(
      req.user,
      id,
      updateWishlistDto,
    );
    return toPublicResponseWishlist(result);
  }

  @Delete(':id(\\d+)')
  async removeById(
    @Req() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.wishlistsService.removeByUserAndId(req.user, id);
    return toPublicResponseWishlist(result);
  }
}
