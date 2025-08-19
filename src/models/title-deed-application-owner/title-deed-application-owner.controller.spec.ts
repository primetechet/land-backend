import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationOwnerController } from './title-deed-application-owner.controller';
import { TitleDeedApplicationOwnerService } from './title-deed-application-owner.service';

describe('TitleDeedApplicationOwnerController', () => {
  let controller: TitleDeedApplicationOwnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedApplicationOwnerController],
      providers: [TitleDeedApplicationOwnerService],
    }).compile();

    controller = module.get<TitleDeedApplicationOwnerController>(TitleDeedApplicationOwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
