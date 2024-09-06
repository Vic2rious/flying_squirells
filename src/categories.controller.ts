import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Param,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { categories as CategoriesModel } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getHello(): string {
    return 'Letqshti katerici go brrr';
  }

  // Get a single category by ID
  @Get('categories/:id')
  async getCategoryById(@Param('id') id: string): Promise<CategoriesModel> {
    if (isNaN(Number(id))) {
      throw new BadRequestException('Invalid ID format, samo cifri be manqk');
    }
    const category = await this.categoriesService.category({ id: Number(id) });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${id} not found, opitaj pak`,
      );
    }
    return category;
  }

  // Get all categories
  @Get('categories')
  async getAllCategories(): Promise<CategoriesModel[]> {
    console.log('Categories endpoint hit');
    return this.categoriesService.categories();
  }

  // Create a new category
  @Post('categories')
  @HttpCode(201)
  async createCategory(
    @Body() categoryData: Prisma.categoriesCreateInput,
  ): Promise<CategoriesModel> {
    const existingCategory = await this.categoriesService.findFirst({
      where: { name: categoryData.name },
    });
    if (existingCategory) {
      throw new ConflictException(
        'Category with this name already exists, bravo shef',
      );
    }
    return this.categoriesService.createCategory(categoryData);
  }

  // Update an existing category
  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateData: Prisma.categoriesUpdateInput,
  ): Promise<CategoriesModel> {
    return this.categoriesService.updateCategory({
      where: { id: Number(id) },
      data: updateData,
    });
  }

  // Delete a category by ID
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string): Promise<CategoriesModel> {
    return this.categoriesService.deleteCategory({ id: Number(id) });
  }
}
