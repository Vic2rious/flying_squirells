import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Letqshti Katerici API')
    .setDescription(
      'API for managing categories, products, orders and reviews!',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // This will serve Swagger UI at /api

  await app.listen(3000);
  console.log(`Server listening on: http://localhost:3000/`);

  // app.enableCors({
  //   origin: true, // Replace with your frontend's URL
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true, // If you need to include cookies or authentication info
  // });
}

bootstrap();
