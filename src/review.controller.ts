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
import { reviews as ReviewModel } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Get all reviews, with optional filter for product ID
  @Get()
  async getAllReviews(
    @Query('productId') productId?: string,
  ): Promise<ReviewModel[]> {
    return this.reviewService.getAllReviews(
      productId ? Number(productId) : undefined,
    );
  }

  // Get a single review by ID
  @Get(':id')
  async getReviewById(@Param('id') id: string): Promise<ReviewModel> {
    const review = await this.reviewService.getReviewById(Number(id));
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  // Create a new review
  @Post()
  async createReview(
    @Body() reviewData: Prisma.reviewsCreateInput,
  ): Promise<ReviewModel> {
    return this.reviewService.createReview(reviewData);
  }
}
