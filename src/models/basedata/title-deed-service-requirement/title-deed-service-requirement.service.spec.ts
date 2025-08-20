import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedServiceRequirementService } from './title-deed-service-requirement.service';

describe('TitleDeedServiceRequirementService', () => {
  let service: TitleDeedServiceRequirementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedServiceRequirementService],
    }).compile();

    service = module.get<TitleDeedServiceRequirementService>(TitleDeedServiceRequirementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
