import { Module } from '@nestjs/common';
import { RejectionReasonService } from './rejection-reason.service';
import { RejectionReasonController } from './rejection-reason.controller';

@Module({
  controllers: [RejectionReasonController],
  providers: [RejectionReasonService],
})
export class RejectionReasonModule {}
