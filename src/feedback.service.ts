import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { feedback, Prisma } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  // Create new feedback
  async createFeedback(data: Prisma.feedbackCreateInput): Promise<feedback> {
    return this.prisma.feedback.create({
      data,
    });
  }

  // Get all feedback, with an option to filter by archived status
  async getAllFeedback(isArchived: boolean | undefined): Promise<feedback[]> {
    return this.prisma.feedback.findMany({
      where: isArchived !== undefined ? { is_archived: isArchived } : {},
    });
  }

  // Archive feedback by ID
  async archiveFeedback(id: number): Promise<feedback> {
    return this.prisma.feedback.update({
      where: { id },
      data: { is_archived: true },
    });
  }

  // Get single feedback by ID
  async getFeedbackById(id: number): Promise<feedback | null> {
    return this.prisma.feedback.findUnique({
      where: { id },
    });
  }
}
