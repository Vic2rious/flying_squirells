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
import { feedback as FeedbackModel, Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // Create new feedback
  @Post()
  @ApiOperation({ summary: 'Create new feedback' })
  @ApiBody({
    description: 'Data for creating new feedback',
    schema: {
      example: {
        content: 'This is feedback content',
        userId: 1,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Feedback created successfully',
    schema: {
      example: {
        id: 1,
        content: 'This is feedback content',
        userId: 1,
        createdAt: '2024-09-06T10:00:00.000Z',
        archived: false,
      },
    },
  })
  async createFeedback(
    @Body() feedbackData: Prisma.feedbackCreateInput,
  ): Promise<FeedbackModel> {
    return this.feedbackService.createFeedback(feedbackData);
  }

  // Get all feedback with an optional filter for archived status
  @Get()
  @ApiOperation({ summary: 'Get all feedback with optional archived filter' })
  @ApiQuery({
    name: 'archived',
    required: false,
    type: String,
    description: 'Filter feedback by archived status (true/false)',
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'List of feedback',
    schema: {
      example: [
        {
          id: 1,
          content: 'This is feedback content',
          userId: 1,
          createdAt: '2024-09-06T10:00:00.000Z',
          archived: false,
        },
        {
          id: 2,
          content: 'Another feedback',
          userId: 2,
          createdAt: '2024-09-07T12:00:00.000Z',
          archived: true,
        },
      ],
    },
  })
  async getAllFeedback(
    @Query('archived') archived: string,
  ): Promise<FeedbackModel[]> {
    const isArchived =
      archived === 'true' ? true : archived === 'false' ? false : undefined;
    return this.feedbackService.getAllFeedback(isArchived);
  }

  // Get feedback by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the feedback to retrieve',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns feedback by ID',
    schema: {
      example: {
        id: 1,
        content: 'This is feedback content',
        userId: 1,
        createdAt: '2024-09-06T10:00:00.000Z',
        archived: false,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async getFeedbackById(@Param('id') id: string): Promise<FeedbackModel> {
    const feedback = await this.feedbackService.getFeedbackById(Number(id));
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  // Archive feedback by ID
  @Put(':id/archive')
  @ApiOperation({ summary: 'Archive feedback by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the feedback to archive',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback archived successfully',
    schema: {
      example: {
        id: 1,
        content: 'This is feedback content',
        userId: 1,
        createdAt: '2024-09-06T10:00:00.000Z',
        archived: true,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async archiveFeedback(@Param('id') id: string): Promise<FeedbackModel> {
    const feedback = await this.feedbackService.getFeedbackById(Number(id));
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return this.feedbackService.archiveFeedback(Number(id));
  }
}
