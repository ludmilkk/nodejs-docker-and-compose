import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { emptyToUndefined } from '../transformers/string-dto.transformer';

export const IsOptionalString = () =>
  applyDecorators(Transform(emptyToUndefined), IsOptional(), IsString());

export const IsOptionalEmail = () =>
  applyDecorators(Transform(emptyToUndefined), IsOptional(), IsEmail());

export const IsOptionalURL = () =>
  applyDecorators(Transform(emptyToUndefined), IsOptional(), IsUrl());
