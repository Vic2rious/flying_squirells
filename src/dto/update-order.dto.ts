import { Prisma } from '@prisma/client';
import { IsArray, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
  @IsNotEmpty()
  orderData: Prisma.ordersUpdateInput;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  productIds: number[];

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  amounts: number[];
}
