import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Cats')
@Controller('cats')
export class CatsController {
  // Get all cats
  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all cats' })
  @ApiResponse({
    status: 200,
    description: 'List of all cats',
    schema: {
      example: ['This action returns all cats'],
    },
  })
  findAll() {
    return `This action returns all cats`;
  }

  // Get a single cat by ID
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a cat by its ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the cat to retrieve',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of a cat',
    schema: {
      example: 'This action returns a #1 cat',
    },
  })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  // Delete a cat by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cat by its ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the cat to delete',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Cat successfully deleted',
    schema: {
      example: 'This action removes a #1 cat',
    },
  })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
