import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { TitleDeedApplicationPaymentService } from './title-deed-application-payment.service';
import { CreatePaymentDto, UpdatePaymentDto, MarkPaymentPaidDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Title Deed Application Payments')
@Controller('title-deed-application-payments')
export class TitleDeedApplicationPaymentController {
  constructor(
    private readonly paymentService: TitleDeedApplicationPaymentService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Mark a payment as paid/unpaid' })
  markAsPaid(@Param('id') id: string, @Body() dto: MarkPaymentPaidDto) {
    return this.paymentService.markAsPaid(id, dto);
  }
}
