import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationService } from './title-deed-application.service';

describe('TitleDeedApplicationService', () => {
  let service: TitleDeedApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedApplicationService],
    }).compile();

    service = module.get<TitleDeedApplicationService>(TitleDeedApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
