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
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Prisma, orders as OrdersModel } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Get all orders
  @Get()
  async getAllOrders(): Promise<OrdersModel[]> {
    return this.ordersService.getAllOrders();
  }

  // Get one order by ID
  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<OrdersModel> {
    const order = await this.ordersService.getOrderById(Number(id));
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrdersModel> {
    const { product_ids, amounts, ...orderData } = createOrderDto;
    return this.ordersService.createOrder(orderData, product_ids, amounts);
  }

  // Update an existing order by ID
  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body()
    updateData: {
      orderData: Prisma.ordersUpdateInput;
      productIds: number[];
      amounts: number[];
    },
  ): Promise<OrdersModel> {
    const orderId = Number(id);

    // Ensure the order ID is valid
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid ID format');
    }

    return this.ordersService.updateOrder({
      where: { id: orderId },
      orderData: updateData.orderData,
      productIds: updateData.productIds,
      amounts: updateData.amounts,
    });
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<OrdersModel> {
    const order = await this.ordersService.getOrderById(Number(id));

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.ordersService.deleteOrder({ id: Number(id) });
  }
}
