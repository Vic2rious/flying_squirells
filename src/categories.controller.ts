import {
  Controller,
  Get,
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
    return this.categoriesService.category({ id: Number(id) });
  }

  // Get all categories
  @Get('categories')
  async getAllCategories(): Promise<CategoriesModel[]> {
    console.log('Categories endpoint hit');
    return this.categoriesService.categories();
  }

  // Create a new category
  @Post('categories')
  async createCategory(
    @Body() categoryData: Prisma.categoriesCreateInput,
  ): Promise<CategoriesModel> {
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
