import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Product Name' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Short description of the product',
    example: 'Short description',
  })
  @IsString()
  short_description: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'Detailed description',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Price of the product', example: 19.99 })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Discount on the product',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    description: 'Quantity of the product in stock',
    example: 100,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Flag to mark product as new',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mark_as_new?: boolean;

  @ApiProperty({
    description: 'Cover photo URL of the product',
    example: 'http://example.com/cover.jpg',
  })
  @IsString()
  cover_photo: string;

  @ApiProperty({
    description: 'Additional photos URLs of the product',
    type: [String],
    example: ['http://example.com/photo1.jpg', 'http://example.com/photo2.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  additional_photos: string[];

  @ApiProperty({
    description: 'Available sizes of the product',
    type: [String],
    example: ['S', 'M', 'L'],
  })
  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @ApiProperty({
    description: 'Available colors of the product',
    type: [String],
    example: ['Red', 'Blue', 'Green'],
  })
  @IsArray()
  @IsString({ each: true })
  colors: string[];

  @ApiProperty({ description: 'Category ID of the product', example: 1 })
  @IsNumber()
  category_id: number;
}
