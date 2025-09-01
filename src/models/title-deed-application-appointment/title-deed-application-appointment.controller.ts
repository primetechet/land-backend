import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TitleDeedApplicationAppointmentService } from './title-deed-application-appointment.service';
import { GetOptionsDto, BookDto, RescheduleDto, SetOffDayDto } from './dto';

@ApiTags('Title Deed Application Appointments')
@ApiBearerAuth()
@Controller('title-deed-application-appointments')
export class TitleDeedApplicationAppointmentController {
  constructor(
    private readonly service: TitleDeedApplicationAppointmentService,
  ) {}

  @Get('options')
  @ApiOperation({ summary: 'Get next 4 appointment options' })
  getNextOptions(@Query() dto: GetOptionsDto) {
    return this.service.getNextOptions(dto);
  }

  @Post('book')
  @ApiOperation({ summary: 'Book an appointment' })
  book(@Body() dto: BookDto) {
    return this.service.book(dto);
  }

  @Post('reschedule')
  @ApiOperation({ summary: 'Reschedule an appointment' })
  reschedule(@Body() dto: RescheduleDto) {
    return this.service.reschedule(dto);
  }

  @Post('off-days')
  @ApiOperation({ summary: 'Set off days for an employee' })
  setOffDays(@Body() dto: SetOffDayDto) {
    return this.service.setOffDays(dto);
  }
}
