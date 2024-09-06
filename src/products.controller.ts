import {
  Controller,
  Query,
  HttpCode,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { products as ProductsModel } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get a single product by ID
  @Get('products/:id')
  async getProductById(@Param('id') id: string): Promise<ProductsModel> {
    if (isNaN(Number(id))) {
      throw new BadRequestException('Invalid ID format, samo cifri be manqk');
    }
    const product = await this.productsService.product({ id: Number(id) });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${id} not found, opitaj pak`,
      );
    }
    return product;
  }

  // Get all products
  @Get('products')
  async getPaginatedProducts(
    @Query('skip') skip: string,
    @Query('take') take: string,
  ): Promise<ProductsModel[]> {
    return this.productsService.products({
      skip: Number(skip) || 0, // Default to 0 if no skip is provided
      take: Number(take) || undefined, // Default to all if no take is provided
    });
  }

  // Create a new product
  @Post('products')
  @HttpCode(204)
  async createProduct(
    @Body() productData: Prisma.productsCreateInput,
  ): Promise<ProductsModel> {
    const existingProduct = await this.productsService.findFirst({
      where: { name: productData.name },
    });

    if (existingProduct) {
      throw new ConflictException(
        'Product with this name already exists, bravo shef',
      );
    }

    return this.productsService.createProduct(productData);
  }

  // Update an existing product by ID
  @Put('products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateData: Prisma.productsUpdateInput,
  ): Promise<ProductsModel> {
    return this.productsService.updateProduct({
      where: { id: Number(id) },
      data: updateData,
    });
  }

  // Delete a product by ID
  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string): Promise<ProductsModel> {
    return this.productsService.deleteProduct({ id: Number(id) });
  }
}
