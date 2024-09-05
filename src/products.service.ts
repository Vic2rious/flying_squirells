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
}
