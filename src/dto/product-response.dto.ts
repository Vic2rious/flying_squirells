import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ description: 'ID of the product', example: 1 })
  id: number;

  @ApiProperty({ description: 'Name of the product', example: 'Product Name' })
  name: string;

  @ApiProperty({
    description: 'Short description of the product',
    example: 'Short description',
  })
  short_description: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'Detailed description',
  })
  description: string;

  @ApiProperty({ description: 'Price of the product', example: 19.99 })
  price: number;

  @ApiProperty({
    description: 'Discount on the product',
    example: 10,
    required: false,
  })
  discount?: number;

  @ApiProperty({
    description: 'Quantity of the product in stock',
    example: 100,
  })
  quantity: number;

  @ApiProperty({
    description: 'Flag to mark product as new',
    example: true,
    required: false,
  })
  mark_as_new?: boolean;

  @ApiProperty({
    description: 'Cover photo URL of the product',
    example: 'http://example.com/cover.jpg',
  })
  cover_photo: string;

  @ApiProperty({
    description: 'Additional photos URLs of the product',
    type: [String],
    example: ['http://example.com/photo1.jpg', 'http://example.com/photo2.jpg'],
  })
  additional_photos: string[];

  @ApiProperty({
    description: 'Available sizes of the product',
    type: [String],
    example: ['S', 'M', 'L'],
  })
  sizes: string[];

  @ApiProperty({
    description: 'Available colors of the product',
    type: [String],
    example: ['Red', 'Blue', 'Green'],
  })
  colors: string[];

  @ApiProperty({ description: 'Category ID of the product', example: 1 })
  category_id: number;

  @ApiProperty({
    description: 'Average review score of the product',
    example: 4.5,
    required: false,
  })
  averageReview?: number;
}
