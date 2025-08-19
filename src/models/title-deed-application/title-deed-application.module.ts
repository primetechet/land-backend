import { Module } from '@nestjs/common';
import { TitleDeedApplicationService } from './title-deed-application.service';
import { TitleDeedApplicationController } from './title-deed-application.controller';

@Module({
  controllers: [TitleDeedApplicationController],
  providers: [TitleDeedApplicationService],
})
export class TitleDeedApplicationModule {}
