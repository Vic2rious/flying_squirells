import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { reviews as ReviewModel, Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Get all reviews, with optional filter for product ID
  @Get()
  @ApiOperation({
    summary: 'Get all reviews with optional filter for product ID',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    type: String,
    description: 'Filter reviews by product ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reviews',
    schema: {
      example: [
        {
          id: 1,
          content: 'Great product!',
          rating: 5,
          productId: 1,
          createdAt: '2024-09-06T10:00:00.000Z',
        },
        {
          id: 2,
          content: 'Not bad',
          rating: 3,
          productId: 1,
          createdAt: '2024-09-07T12:00:00.000Z',
        },
      ],
    },
  })
  async getAllReviews(
    @Query('productId') productId?: string,
  ): Promise<ReviewModel[]> {
    return this.reviewService.getAllReviews(
      productId ? Number(productId) : undefined,
    );
  }

  // Get a single review by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the review to retrieve',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a review by ID',
    schema: {
      example: {
        id: 1,
        content: 'Great product!',
        rating: 5,
        productId: 1,
        createdAt: '2024-09-06T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async getReviewById(@Param('id') id: string): Promise<ReviewModel> {
    const review = await this.reviewService.getReviewById(Number(id));
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  // Create a new review
  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({
    description: 'Data for creating a new review',
    schema: {
      example: {
        content: 'Great product!',
        rating: 5,
        productId: 1,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    schema: {
      example: {
        id: 1,
        content: 'Great product!',
        rating: 5,
        productId: 1,
        createdAt: '2024-09-06T10:00:00.000Z',
      },
    },
  })
  async createReview(
    @Body() reviewData: Prisma.reviewsCreateInput,
  ): Promise<ReviewModel> {
    return this.reviewService.createReview(reviewData);
  }
}
