import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationOwnerService } from './title-deed-application-owner.service';

describe('TitleDeedApplicationOwnerService', () => {
  let service: TitleDeedApplicationOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedApplicationOwnerService],
    }).compile();

    service = module.get<TitleDeedApplicationOwnerService>(TitleDeedApplicationOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
