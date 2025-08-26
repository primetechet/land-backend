import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { CreatePaymentDto, UpdatePaymentDto, MarkPaymentPaidDto } from './dto';

@Injectable()
export class TitleDeedApplicationPaymentService {
  constructor(private readonly prisma: DatabaseService) {}

  async findOne(id: string) {
    const record = await this.prisma.titleDeedApplicationPayment.findUnique({
      where: { id },
    });
    if (!record) throw new NotFoundException('Payment not found');
    return record;
  }

  async markAsPaid(id: string, dto: MarkPaymentPaidDto) {
    const payment = await this.findOne(id);
    if (payment.paid && dto.paid)
      throw new BadRequestException('Payment already marked as paid');

    return this.prisma.titleDeedApplicationPayment.update({
      where: { id },
      data: {
        paid: dto.paid,
        paid_at: dto.paid ? new Date() : null,
        paid_by_id: dto.paid_by_id ?? null,
      },
    });
  }
}
