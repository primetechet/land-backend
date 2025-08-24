import { Test, TestingModule } from '@nestjs/testing';
import { LandGradeService } from './land-grade.service';

describe('LandGradeService', () => {
  let service: LandGradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandGradeService],
    }).compile();

    service = module.get<LandGradeService>(LandGradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
