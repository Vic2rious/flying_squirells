import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { categories as CategoriesModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories/:id')
  async getCategoryById(@Param('id') id: string): Promise<CategoriesModel> {
    return this.categoriesService.category({ id: Number(id) });
  }

  @Get('categories')
  async getAllCategories(): Promise<CategoriesModel[]> {
    console.log('endpoint hit');
    return this.categoriesService.categories();
  }
}
