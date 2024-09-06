import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { reviews, Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // Get all reviews, optionally filter by product ID
  async getAllReviews(productId?: number): Promise<reviews[]> {
    return this.prisma.reviews.findMany({
      where: productId ? { product_id: productId } : {},
    });
  }

  // Get a single review by ID
  async getReviewById(id: number): Promise<reviews | null> {
    return this.prisma.reviews.findUnique({
      where: { id },
    });
  }

  // Create a new review
  async createReview(data: Prisma.reviewsCreateInput): Promise<reviews> {
    return this.prisma.reviews.create({
      data,
    });
  }
}
