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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Products') // Swagger tag for grouping
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    schema: {
      example: {
        id: 1,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100.0,
        averageReview: 4.5,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string): Promise<{
    id: number;
    name: string;
    description: string;
    price: number;
    averageReview: number | null;
  }> {
    if (isNaN(Number(id))) {
      throw new BadRequestException('Invalid ID format');
    }
    const product = await this.productsService.product({ id: Number(id) });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const averageReview = await this.productsService.getAverageReview(
      Number(id),
    );

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      averageReview,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of products to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of products to return',
  })
  @ApiResponse({
    status: 200,
    description: 'A paginated list of products',
    schema: {
      example: {
        pagination: { total: 100 },
        data: [
          {
            id: 1,
            name: 'Product 1',
            description: 'Description of Product 1',
            price: 100.0,
            averageReview: 4.5,
          },
        ],
      },
    },
  })
  async getPaginatedProducts(
    @Query('skip') skip: string,
    @Query('take') take: string,
  ): Promise<{
    pagination: { total: number };
    data: {
      id: number;
      name: string;
      description: string;
      price: number;
      averageReview: number | null;
    }[];
  }> {
    const skipNumber = Number(skip) || 0;
    const takeNumber = Number(take) || undefined;

    const totalCount = await this.productsService.countProducts();

    const products = await this.productsService.products({
      skip: skipNumber,
      take: takeNumber,
    });

    const data = await Promise.all(
      products.map(async (product) => {
        const averageReview = await this.productsService.getAverageReview(
          product.id,
        );
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          averageReview,
        };
      }),
    );

    return {
      pagination: {
        total: totalCount,
      },
      data,
    };
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ description: 'Product data to create', type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    //type: productData
  })
  @ApiResponse({
    status: 409,
    description: 'Product with this name already exists',
  })
  async createProduct(
    @Body() productData: CreateProductDto,
  ): Promise<ProductsModel> {
    const existingProduct = await this.productsService.findFirst({
      where: { name: productData.name },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    return this.productsService.createProduct(productData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: 'number' })
  @ApiBody({ description: 'Product data to update', type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    //type: ProductsModel,
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateData: UpdateProductDto,
  ): Promise<ProductsModel> {
    return this.productsService.updateProduct({
      where: { id: Number(id) },
      data: updateData,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    //type: ProductsModel,
  })
  async deleteProduct(@Param('id') id: string): Promise<ProductsModel> {
    return this.productsService.deleteProduct({ id: Number(id) });
  }
}
