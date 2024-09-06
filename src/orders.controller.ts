import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateOrderDto } from './dto/update-order.dto'; // Assuming you create this DTO

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Get all orders
  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'A list of all orders',
    schema: {
      example: [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          company_name: 'ACME Corp.',
          country: 'USA',
          city: 'New York',
          address: '123 Main St',
          postal_code: '10001',
          phone_number: '+11234567890',
          email: 'john.doe@example.com',
          price: 200.5,
          created_at: '2023-09-01T12:00:00Z',
          updated_at: '2023-09-01T12:00:00Z',
          order_products: [
            { product_id: 1, amount: 2 },
            { product_id: 2, amount: 1 },
          ],
        },
      ],
    },
  })
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // Get one order by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'ID of the order', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Order found',
    schema: {
      example: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        company_name: 'ACME Corp.',
        country: 'USA',
        city: 'New York',
        address: '123 Main St',
        postal_code: '10001',
        phone_number: '+11234567890',
        email: 'john.doe@example.com',
        price: 200.5,
        created_at: '2023-09-01T12:00:00Z',
        updated_at: '2023-09-01T12:00:00Z',
        order_products: [
          { product_id: 1, amount: 2 },
          { product_id: 2, amount: 1 },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(@Param('id') id: string) {
    const order = await this.ordersService.getOrderById(Number(id));
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  // Create a new order
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    description: 'Order data to create',
    type: CreateOrderDto,
    examples: {
      example1: {
        summary: 'Create order',
        value: {
          first_name: 'John',
          last_name: 'Doe',
          company_name: 'ACME Corp.',
          country: 'USA',
          city: 'New York',
          address: '123 Main St',
          postal_code: '10001',
          phone_number: '+11234567890',
          email: 'john.doe@example.com',
          product_ids: [1, 2],
          amounts: [2, 1],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const { product_ids, amounts, ...orderData } = createOrderDto;
    return this.ordersService.createOrder(orderData, product_ids, amounts);
  }

  // Update an existing order by ID
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', description: 'ID of the order', type: 'number' })
  @ApiBody({
    description: 'Order data to update',
    type: UpdateOrderDto,
    examples: {
      example1: {
        summary: 'Update order',
        value: {
          orderData: {
            first_name: 'Jane',
            last_name: 'Doe',
            city: 'Los Angeles',
            country: 'USA',
          },
          productIds: [1, 3],
          amounts: [1, 2],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateData: UpdateOrderDto,
  ) {
    const { productIds, amounts, orderData } = updateData;
    return this.ordersService.updateOrder({
      where: { id: Number(id) },
      productIds,
      amounts,
      orderData,
    });
  }

  // Delete an order by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({ name: 'id', description: 'ID of the order', type: 'number' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async deleteOrder(@Param('id') id: string) {
    const order = await this.ordersService.getOrderById(Number(id));

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.ordersService.deleteOrder({ id: Number(id) });
  }
}
