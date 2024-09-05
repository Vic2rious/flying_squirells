import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log(`Server listening on: http://localhost:3000/`);

  app.enableCors({
    origin: 'http://localhost:4200/', // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // If you need to include cookies or authentication info
  });
}

bootstrap();
