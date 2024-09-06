import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, orders } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Get one order by ID
  async getOrderById(id: number): Promise<orders | null> {
    if (isNaN(Number(id))) {
      throw new BadRequestException('Invalid ID format, samo cifri be manqk');
    }
    const order = await this.prisma.orders.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  // Get all orders
  async getAllOrders(): Promise<orders[]> {
    return this.prisma.orders.findMany();
  }

  async createOrder(
    data: Prisma.ordersCreateInput,
    product_ids: number[],
    amounts: number[],
  ): Promise<orders> {
    if (product_ids.length !== amounts.length) {
      throw new BadRequestException(
        'Product IDs and amounts array lengths must match.',
      );
    }

    // Calculate total price
    let totalPrice = 0;
    for (let i = 0; i < product_ids.length; i++) {
      const product = await this.prisma.products.findUnique({
        where: { id: product_ids[i] },
      });

      if (!product) {
        throw new BadRequestException(
          `Product with ID ${product_ids[i]} not found.`,
        );
      }

      totalPrice += Number(product.price) * amounts[i];
    }

    // Create the order
    const order = await this.prisma.orders.create({
      data: {
        ...data,
        price: totalPrice,
      },
    });

    // Insert into the order_products table
    for (let i = 0; i < product_ids.length; i++) {
      await this.prisma.order_products.create({
        data: {
          order_id: order.id,
          product_id: product_ids[i],
          amount: amounts[i],
        },
      });
    }

    return order;
  }

  async updateOrder(params: {
    where: Prisma.ordersWhereUniqueInput;
    data: Prisma.ordersUpdateInput;
    productIds: number[];
    amounts: number[];
  }): Promise<orders> {
    const { where, data, productIds, amounts } = params;

    const existingOrder = await this.getOrderById(where.id);
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${where.id} not found`);
    }

    // Delete existing order_products related to this order
    await this.prisma.order_products.deleteMany({
      where: {
        order_id: where.id,
      },
    });

    // Insert new order_products with product IDs and amounts
    for (let i = 0; i < productIds.length; i++) {
      await this.prisma.order_products.create({
        data: {
          order_id: where.id,
          product_id: productIds[i],
          amount: amounts[i],
        },
      });
    }

    // Update the order itself
    return this.prisma.orders.update({
      where,
      data,
    });
  }

  async deleteOrder(where: Prisma.ordersWhereUniqueInput): Promise<orders> {
    // First, delete related entries from order_products
    await this.prisma.order_products.deleteMany({
      where: {
        order_id: where.id,
      },
    });

    // Delete the order
    return this.prisma.orders.delete({
      where,
    });
  }
}
