import { Module } from '@nestjs/common';
import { TitleDeedApplicationAppointmentService } from './title-deed-application-appointment.service';
import { TitleDeedApplicationAppointmentController } from './title-deed-application-appointment.controller';

@Module({
  controllers: [TitleDeedApplicationAppointmentController],
  providers: [TitleDeedApplicationAppointmentService],
})
export class TitleDeedApplicationAppointmentModule {}
