import { Test, TestingModule } from '@nestjs/testing';
import { DisabilityStatusService } from './disability-status.service';

describe('DisabilityStatusService', () => {
  let service: DisabilityStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisabilityStatusService],
    }).compile();

    service = module.get<DisabilityStatusService>(DisabilityStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
