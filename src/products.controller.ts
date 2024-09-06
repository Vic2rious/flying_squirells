import {
  Controller,
  Query,
  Get,
  BadRequestException,
  NotFoundException,
  HttpCode,
  ConflictException,
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
  async getProductById(
    @Param('id') id: string,
  ): Promise<{ product: ProductsModel; averageReview: number | null }> {
    if (isNaN(Number(id))) {
      throw new BadRequestException('Invalid ID format');
    }
    const product = await this.productsService.product({ id: Number(id) });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Get the average review score
    const averageReview = await this.productsService.getAverageReview(
      Number(id),
    );

    return { product, averageReview };
  }

  // Get all products with pagination and average reviews
  @Get('products')
  async getPaginatedProducts(
    @Query('skip') skip: string,
    @Query('take') take: string,
  ): Promise<{
    pagination: { total: number };
    data: { product: ProductsModel; averageReview: number | null }[];
  }> {
    const skipNumber = Number(skip) || 0;
    const takeNumber = Number(take) || undefined;

    // Get the total count of products
    const totalCount = await this.productsService.countProducts();

    // Get the paginated products
    const products = await this.productsService.products({
      skip: skipNumber,
      take: takeNumber,
    });

    // For each product, fetch the average review
    const data = await Promise.all(
      products.map(async (product) => {
        const averageReview = await this.productsService.getAverageReview(
          product.id,
        );
        return { product, averageReview };
      }),
    );

    return {
      pagination: {
        total: totalCount,
      },
      data,
    };
  }

  // Create a new product
  @Post('products')
  @HttpCode(201)
  async createProduct(
    @Body() productData: Prisma.productsCreateInput,
  ): Promise<ProductsModel> {
    const existingProduct = await this.productsService.findFirst({
      where: { name: productData.name },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
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
