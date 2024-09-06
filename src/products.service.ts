import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { products, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Get a single product by unique input (e.g., id)
  async product(
    productWhereUniqueInput: Prisma.productsWhereUniqueInput,
  ): Promise<products | null> {
    return this.prisma.products.findUnique({
      where: productWhereUniqueInput,
    });
  }

  // Get multiple products with optional filters
  async products(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.productsWhereUniqueInput;
      where?: Prisma.productsWhereInput;
      orderBy?: Prisma.productsOrderByWithRelationInput;
    } = {},
  ): Promise<products[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.products.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  // Get total count of products
  async countProducts(where?: Prisma.productsWhereInput): Promise<number> {
    return this.prisma.products.count({
      where,
    });
  }

  // Create a new product
  async createProduct(data: Prisma.productsCreateInput): Promise<products> {
    return this.prisma.products.create({
      data,
    });
  }

  // Update an existing product by unique input (e.g., id)
  async updateProduct(params: {
    where: Prisma.productsWhereUniqueInput;
    data: Prisma.productsUpdateInput;
  }): Promise<products> {
    const { where, data } = params;
    return this.prisma.products.update({
      where,
      data,
    });
  }

  // Delete a product by unique input (e.g., id)
  async deleteProduct(
    where: Prisma.productsWhereUniqueInput,
  ): Promise<products> {
    return this.prisma.products.delete({
      where,
    });
  }

  async findFirst(params: {
    where: Prisma.productsWhereInput;
  }): Promise<products | null> {
    const { where } = params;
    return this.prisma.products.findFirst({
      where,
    });
  }

  // Get average review score for a product
  async getAverageReview(productId: number): Promise<number | null> {
    const reviews = await this.prisma.reviews.aggregate({
      _avg: {
        value: true, // Aggregates the average of the "value" column (review score)
      },
      where: {
        product_id: productId,
      },
    });

    return reviews._avg.value ?? null; // If no reviews, return null
  }
}
