import { Test, TestingModule } from '@nestjs/testing';
import { RejectionReasonService } from './rejection-reason.service';

describe('RejectionReasonService', () => {
  let service: RejectionReasonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RejectionReasonService],
    }).compile();

    service = module.get<RejectionReasonService>(RejectionReasonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
