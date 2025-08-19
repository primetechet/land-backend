import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedServiceController } from './title-deed-service.controller';
import { TitleDeedServiceService } from './title-deed-service.service';

describe('TitleDeedServiceController', () => {
  let controller: TitleDeedServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedServiceController],
      providers: [TitleDeedServiceService],
    }).compile();

    controller = module.get<TitleDeedServiceController>(TitleDeedServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
