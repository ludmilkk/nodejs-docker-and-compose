import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
  @Type(() => Number)
  @IsInt()
  itemId: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
