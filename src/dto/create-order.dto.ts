import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  Length,
  Matches,
  IsEmail,
  IsPhoneNumber,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 256)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 256)
  last_name: string;

  @IsString()
  @IsOptional()
  @Length(2, 256)
  company_name?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 256)
  country: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 256)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 512)
  address: string;

  @IsString()
  @Matches(/^[0-9]{4}$/, {
    message: 'Postal code must be a valid Bulgarian postal code (4 digits).',
  })
  postal_code: string;

  @IsPhoneNumber(null, {
    message: 'Phone number must be a valid international phone number.',
  })
  phone_number: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @IsString()
  @IsOptional()
  @Length(0, 1024)
  additional_info?: string;

  // Arrays for product IDs and amounts
  @IsArray()
  @ArrayNotEmpty()
  product_ids: number[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @Type(() => Number)
  amounts: number[];
}
