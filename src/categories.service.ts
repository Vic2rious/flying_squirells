import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { categories, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Get a single category by unique input (e.g., id)
  async category(
    userWhereUniqueInput: Prisma.categoriesWhereUniqueInput,
  ): Promise<categories | null> {
    return this.prisma.categories.findUnique({
      where: userWhereUniqueInput,
    });
  }

  // Get multiple categories with optional filters
  async categories(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.categoriesWhereUniqueInput;
      where?: Prisma.categoriesWhereInput;
      orderBy?: Prisma.categoriesOrderByWithRelationInput;
    } = {},
  ): Promise<categories[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.categories.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  // Create a new category
  async createCategory(
    data: Prisma.categoriesCreateInput,
  ): Promise<categories> {
    return this.prisma.categories.create({
      data,
    });
  }

  // Update an existing category by unique input (e.g., id)
  async updateCategory(params: {
    where: Prisma.categoriesWhereUniqueInput;
    data: Prisma.categoriesUpdateInput;
  }): Promise<categories> {
    const { where, data } = params;
    return this.prisma.categories.update({
      where,
      data,
    });
  }

  // Delete a category by unique input (e.g., id)
  async deleteCategory(
    where: Prisma.categoriesWhereUniqueInput,
  ): Promise<categories> {
    return this.prisma.categories.delete({
      where,
    });
  }
}
