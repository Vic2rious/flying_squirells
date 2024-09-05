import {
  Controller,
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
    return this.productsService.product({ id: Number(id) });
  }

  // Get all products
  @Get('products')
  async getAllProducts(): Promise<ProductsModel[]> {
    console.log('Products endpoint hit');
    return this.productsService.products();
  }

  // Create a new product
  @Post('products')
  async createProduct(
    @Body() productData: Prisma.productsCreateInput,
  ): Promise<ProductsModel> {
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
