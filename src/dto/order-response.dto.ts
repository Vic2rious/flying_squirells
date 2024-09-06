import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John' })
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @ApiProperty({ example: 'Sofia' })
  city: string;

  @ApiProperty({ example: 'Bulgaria' })
  country: string;

  @ApiProperty({ example: '1234' })
  postal_code: string;

  @ApiProperty({ example: '+359123456789' })
  phone_number: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: [1, 2] })
  product_ids: number[];

  @ApiProperty({ example: [2, 1] })
  amounts: number[];

  @ApiProperty({ example: 'Some additional information', required: false })
  additional_info?: string;
}
