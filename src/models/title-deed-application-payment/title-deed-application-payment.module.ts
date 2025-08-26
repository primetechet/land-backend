import { Module } from '@nestjs/common';
import { TitleDeedApplicationPaymentService } from './title-deed-application-payment.service';
import { TitleDeedApplicationPaymentController } from './title-deed-application-payment.controller';

@Module({
  controllers: [TitleDeedApplicationPaymentController],
  providers: [TitleDeedApplicationPaymentService],
})
export class TitleDeedApplicationPaymentModule {}
