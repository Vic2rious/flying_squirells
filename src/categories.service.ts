import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { categories, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async category(
    userWhereUniqueInput: Prisma.categoriesWhereUniqueInput,
  ): Promise<categories | null> {
    return this.prisma.categories.findUnique({
      where: userWhereUniqueInput,
    });
  }

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
}
