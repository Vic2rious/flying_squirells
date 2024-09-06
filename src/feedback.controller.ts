import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { feedback as FeedbackModel } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // Create new feedback
  @Post()
  async createFeedback(
    @Body() feedbackData: Prisma.feedbackCreateInput,
  ): Promise<FeedbackModel> {
    return this.feedbackService.createFeedback(feedbackData);
  }

  // Get all feedback with an optional filter for archived status
  @Get()
  async getAllFeedback(
    @Query('archived') archived: string,
  ): Promise<FeedbackModel[]> {
    const isArchived =
      archived === 'true' ? true : archived === 'false' ? false : undefined;
    return this.feedbackService.getAllFeedback(isArchived);
  }

  // Get feedback by ID
  @Get(':id')
  async getFeedbackById(@Param('id') id: string): Promise<FeedbackModel> {
    const feedback = await this.feedbackService.getFeedbackById(Number(id));
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  // Archive feedback by ID
  @Put(':id/archive')
  async archiveFeedback(@Param('id') id: string): Promise<FeedbackModel> {
    const feedback = await this.feedbackService.getFeedbackById(Number(id));
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return this.feedbackService.archiveFeedback(Number(id));
  }
}
