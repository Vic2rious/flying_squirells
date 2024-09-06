import { Module } from '@nestjs/common';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

import { PaymentsController } from './payment.controller';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CatsController } from './cats/cats.controller';

import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    CategoriesController,
    CatsController,
    ProductsController,
    OrdersController,
    FeedbackController,
    ReviewController,
    PaymentsController,
    AppController,
  ],
  providers: [
    CategoriesService,
    OrdersService,
    PrismaService,
    ProductsService,
    FeedbackService,
    ReviewService,
    AppService,
  ],
})
export class AppModule {}
