import { Module } from '@nestjs/common';
import { DisabilityStatusService } from './disability-status.service';
import { DisabilityStatusController } from './disability-status.controller';

@Module({
  controllers: [DisabilityStatusController],
  providers: [DisabilityStatusService],
})
export class DisabilityStatusModule {}
