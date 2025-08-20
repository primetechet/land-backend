import { Module } from '@nestjs/common';
import { TitleDeedServiceRequirementService } from './title-deed-service-requirement.service';
import { TitleDeedServiceRequirementController } from './title-deed-service-requirement.controller';

@Module({
  controllers: [TitleDeedServiceRequirementController],
  providers: [TitleDeedServiceRequirementService],
})
export class TitleDeedServiceRequirementModule {}
