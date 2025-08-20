import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedServiceBranchService } from './title-deed-service-branch.service';

describe('TitleDeedServiceBranchService', () => {
  let service: TitleDeedServiceBranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedServiceBranchService],
    }).compile();

    service = module.get<TitleDeedServiceBranchService>(TitleDeedServiceBranchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
