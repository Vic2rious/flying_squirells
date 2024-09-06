import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: CategoriesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [AppService],
    }).compile();

    appController = app.get<CategoriesController>(CategoriesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
