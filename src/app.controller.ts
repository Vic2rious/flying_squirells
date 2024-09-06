import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Wildcard route to catch all non-existing routes
  @Get('*')
  @ApiOperation({ summary: 'Catch-all route for handling non-existing routes' })
  @ApiResponse({
    status: 404,
    description: 'Resource not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Resource not found, takova jivotno nqma',
        error: 'Not Found',
      },
    },
  })
  handleNotFound(): void {
    throw new NotFoundException('Resource not found, takova jivotno nqma');
  }
}
