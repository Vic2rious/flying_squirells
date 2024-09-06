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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
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
      ...product,
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
            short_description: 'Short description of Product 1',
            description: 'Description of Product 1',
            price: 100.0,
            discount: 10,
            quantity: 50,
            mark_as_new: true,
            cover_photo: 'http://example.com/cover.jpg',
            additional_photos: [
              'http://example.com/photo1.jpg',
              'http://example.com/photo2.jpg',
            ],
            sizes: ['S', 'M', 'L'],
            colors: ['Red', 'Blue'],
            category_id: 1,
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
    data: ProductResponseDto[];
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
          ...product,
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
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Product with this name already exists',
  })
  async createProduct(
    @Body() productData: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.productsService.findFirst({
      where: { name: productData.name },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    const createdProduct =
      await this.productsService.createProduct(productData);

    return {
      ...createdProduct,
      price: Number(createdProduct.price),
      averageReview: null, // Newly created products may not have reviews yet
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: 'number' })
  @ApiBody({ description: 'Product data to update', type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateData: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const updatedProduct = await this.productsService.updateProduct({
      where: { id: Number(id) },
      data: updateData,
    });

    return {
      ...updatedProduct,
      price: Number(updatedProduct.price),
      averageReview: await this.productsService.getAverageReview(Number(id)),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    type: ProductResponseDto,
  })
  async deleteProduct(@Param('id') id: string): Promise<ProductResponseDto> {
    const deletedProduct = await this.productsService.deleteProduct({
      id: Number(id),
    });

    return {
      ...deletedProduct,
      price: Number(deletedProduct.price),
      averageReview: await this.productsService.getAverageReview(Number(id)),
    };
  }
}
