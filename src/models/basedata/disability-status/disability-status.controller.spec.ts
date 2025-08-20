import { Test, TestingModule } from '@nestjs/testing';
import { DisabilityStatusController } from './disability-status.controller';
import { DisabilityStatusService } from './disability-status.service';

describe('DisabilityStatusController', () => {
  let controller: DisabilityStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisabilityStatusController],
      providers: [DisabilityStatusService],
    }).compile();

    controller = module.get<DisabilityStatusController>(DisabilityStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
