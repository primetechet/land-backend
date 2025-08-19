import { Module } from '@nestjs/common';
import { TitleDeedApplicationOwnerService } from './title-deed-application-owner.service';
import { TitleDeedApplicationOwnerController } from './title-deed-application-owner.controller';

@Module({
  controllers: [TitleDeedApplicationOwnerController],
  providers: [TitleDeedApplicationOwnerService],
})
export class TitleDeedApplicationOwnerModule {}
