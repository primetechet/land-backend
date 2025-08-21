import { Module } from '@nestjs/common';
import { TitleDeedApplicationReviewService } from './title-deed-application-review.service';
import { TitleDeedApplicationReviewController } from './title-deed-application-review.controller';
import { TitleDeedApplicationReviewValidator } from './title-deed-application-review.validation';

@Module({
  controllers: [TitleDeedApplicationReviewController],
  providers: [
    TitleDeedApplicationReviewService,
    TitleDeedApplicationReviewValidator,
  ],
})
export class TitleDeedApplicationReviewModule {}
