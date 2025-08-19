import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationController } from './title-deed-application.controller';
import { TitleDeedApplicationService } from './title-deed-application.service';

describe('TitleDeedApplicationController', () => {
  let controller: TitleDeedApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedApplicationController],
      providers: [TitleDeedApplicationService],
    }).compile();

    controller = module.get<TitleDeedApplicationController>(TitleDeedApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
