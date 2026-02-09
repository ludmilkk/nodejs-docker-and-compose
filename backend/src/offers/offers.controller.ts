import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { toPublicResponseOffer } from '../common/utils/offer';
import { UserRequest } from '../common/types/routes';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OffersController {
  constructor(private readonly offers: OffersService) {}

  @Post()
  async postOffer(@Req() req: UserRequest, @Body() dto: CreateOfferDto) {
    const result = await this.offers.create(req.user, dto);
    return toPublicResponseOffer(result);
  }

  @Get()
  findAll(@Req() req: UserRequest) {
    return this.offers.findManyWithUser(req.user);
  }

  @Get(':id(\\d+)')
  findOne(@Req() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
    return this.offers.findOneWithUser(req.user, id);
  }
}
