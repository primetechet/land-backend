import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationReviewService } from './title-deed-application-review.service';

describe('TitleDeedApplicationReviewService', () => {
  let service: TitleDeedApplicationReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedApplicationReviewService],
    }).compile();

    service = module.get<TitleDeedApplicationReviewService>(TitleDeedApplicationReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
