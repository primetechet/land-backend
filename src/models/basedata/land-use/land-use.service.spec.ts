import { Test, TestingModule } from '@nestjs/testing';
import { LandUseService } from './land-use.service';

describe('LandUseService', () => {
  let service: LandUseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandUseService],
    }).compile();

    service = module.get<LandUseService>(LandUseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
