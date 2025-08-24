import { Test, TestingModule } from '@nestjs/testing';
import { LandUseController } from './land-use.controller';
import { LandUseService } from './land-use.service';

describe('LandUseController', () => {
  let controller: LandUseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandUseController],
      providers: [LandUseService],
    }).compile();

    controller = module.get<LandUseController>(LandUseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
