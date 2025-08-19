import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedServiceService } from './title-deed-service.service';

describe('TitleDeedServiceService', () => {
  let service: TitleDeedServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedServiceService],
    }).compile();

    service = module.get<TitleDeedServiceService>(TitleDeedServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
