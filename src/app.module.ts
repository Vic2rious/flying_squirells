import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { ProductsController } from './products.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { ConfigModule } from '@nestjs/config';
import { CategoriesService } from './categories.service';
import { ProductsService } from './products.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CategoriesController, CatsController, ProductsController],
  providers: [AppService, CategoriesService, PrismaService, ProductsService],
})
export class AppModule {}
