import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationReviewController } from './title-deed-application-review.controller';
import { TitleDeedApplicationReviewService } from './title-deed-application-review.service';

describe('TitleDeedApplicationReviewController', () => {
  let controller: TitleDeedApplicationReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedApplicationReviewController],
      providers: [TitleDeedApplicationReviewService],
    }).compile();

    controller = module.get<TitleDeedApplicationReviewController>(TitleDeedApplicationReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
