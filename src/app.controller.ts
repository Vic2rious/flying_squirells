import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Wildcard route to catch all non-existing routes
  @Get('*')
  handleNotFound(): void {
    throw new NotFoundException('Resource not found, takova jivotno nqma');
  }
}
