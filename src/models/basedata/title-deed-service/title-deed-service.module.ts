import { Module } from '@nestjs/common';
import { TitleDeedServiceService } from './title-deed-service.service';
import { TitleDeedServiceController } from './title-deed-service.controller';

@Module({
  controllers: [TitleDeedServiceController],
  providers: [TitleDeedServiceService],
})
export class TitleDeedServiceModule {}
