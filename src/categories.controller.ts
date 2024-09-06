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
import { categories as CategoriesModel, Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Health check for the categories service' })
  @ApiResponse({
    status: 200,
    description: 'Returns a health check message',
    schema: { example: 'Letqshti katerici go brrr' },
  })
  getHello(): string {
    return 'Letqshti katerici go brrr';
  }

  // Get a single category by ID
  @Get('categories/:id')
  @ApiOperation({ summary: 'Get a single category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested category',
    schema: {
      example: {
        id: 1,
        name: 'Electronics',
        description: 'Category for all electronic products',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
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
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all categories',
    schema: {
      example: [
        { id: 1, name: 'Electronics', description: 'Category for electronics' },
        { id: 2, name: 'Furniture', description: 'Category for furniture' },
      ],
    },
  })
  async getAllCategories(): Promise<CategoriesModel[]> {
    console.log('Categories endpoint hit');
    return this.categoriesService.categories();
  }

  // Create a new category
  @Post('categories')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({
    description: 'Data for the new category',
    schema: {
      example: {
        name: 'Electronics',
        description: 'Category for all electronic products',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Category with this name already exists',
  })
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
  @ApiOperation({ summary: 'Update an existing category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category', type: 'number' })
  @ApiBody({
    description: 'Data to update the category',
    schema: {
      example: {
        name: 'Updated Category Name',
        description: 'Updated description for the category',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
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
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category', type: 'number' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async deleteCategory(@Param('id') id: string): Promise<CategoriesModel> {
    return this.categoriesService.deleteCategory({ id: Number(id) });
  }
}
