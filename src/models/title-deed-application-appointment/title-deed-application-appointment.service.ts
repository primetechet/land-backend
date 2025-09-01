import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { BookDto, GetOptionsDto, RescheduleDto, SetOffDayDto } from './dto';

@Injectable()
export class TitleDeedApplicationAppointmentService {
  constructor(private readonly prisma: DatabaseService) {}

  private async resolveEmployeeIdForApplication(
    applicationId: string,
    overrideEmployeeId?: string,
  ) {
    if (overrideEmployeeId) return overrideEmployeeId;
    const app = await this.prisma.titleDeedApplication.findUnique({
      where: { id: applicationId },
      select: { appointment_required_by_id: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    if (!app.appointment_required_by_id)
      throw new BadRequestException('appointment_required_by_id not set');
    return app.appointment_required_by_id;
  }

  private async isAvailable(
    employeeId: string,
    dateISO: string,
    slotId: string,
  ) {
    const date = new Date(dateISO);
    const off = await this.prisma.employeeOffSlot.findFirst({
      where: { employee_id: employeeId, date, slot_id: slotId },
    });
    if (off) return false;
    const booked = await this.prisma.titleDeedApplicationAppointment.findFirst({
      where: { employee_id: employeeId, scheduled_date: date, slot_id: slotId },
    });
    return !booked;
  }

  async getNextOptions(dto: GetOptionsDto) {
    const employeeId = await this.resolveEmployeeIdForApplication(
      dto.title_deed_application_id,
    );
    const slots = await this.prisma.slot.findMany({
      orderBy: { start_time: 'asc' },
    });
    if (slots.length === 0)
      throw new BadRequestException('Slots not configured');

    const options: Array<{
      date: string;
      slot_id: string;
      human_time: string;
    }> = [];
    const now = new Date();
    let cursor = new Date(now);
    cursor.setUTCHours(0, 0, 0, 0);

    // Search forward up to 60 days horizon
    for (let day = 0; day < 60 && options.length < 4; day++) {
      const dateISO = cursor.toISOString();
      for (const slot of slots) {
        const available = await this.isAvailable(employeeId, dateISO, slot.id);
        if (!available) continue;
        options.push({
          date: dateISO,
          slot_id: slot.id,
          human_time: `${slot.start_time} - ${slot.end_time}`,
        });
        if (options.length === 4) break;
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return options;
  }

  async book(dto: BookDto) {
    const employeeId = await this.resolveEmployeeIdForApplication(
      dto.title_deed_application_id,
    );

    const date = new Date(dto.scheduled_date);

    // ensure only one active future appointment per app
    const existing =
      await this.prisma.titleDeedApplicationAppointment.findFirst({
        where: {
          title_deed_application_id: dto.title_deed_application_id,
          scheduled_date: { gte: new Date() },
        },
      });
    if (existing)
      throw new BadRequestException(
        'Application already has an upcoming appointment',
      );

    // unique guard by checking availability
    const available = await this.isAvailable(
      employeeId,
      dto.scheduled_date,
      dto.slot_id,
    );
    if (!available)
      throw new BadRequestException('Selected slot is no longer available');

    try {
      return await this.prisma.titleDeedApplicationAppointment.create({
        data: {
          title_deed_application_id: dto.title_deed_application_id,
          employee_id: employeeId,
          scheduled_date: date,
          slot_id: dto.slot_id,
        },
      });
    } catch (e) {
      // on unique fail re-offer
      const options = await this.getNextOptions({
        title_deed_application_id: dto.title_deed_application_id,
      });
      throw new BadRequestException({
        message: 'Slot taken, pick again',
        options,
      });
    }
  }

  async reschedule(dto: RescheduleDto) {
    // resolve current appointment
    const current = dto.appointment_id
      ? await this.prisma.titleDeedApplicationAppointment.findUnique({
          where: { id: dto.appointment_id },
        })
      : await this.prisma.titleDeedApplicationAppointment.findFirst({
          where: {
            title_deed_application_id: dto.title_deed_application_id!,
            scheduled_date: { gte: new Date() },
          },
          orderBy: { scheduled_date: 'asc' },
        });
    if (!current) throw new NotFoundException('No current appointment');

    const app = await this.prisma.titleDeedApplication.findUnique({
      where: { id: current.title_deed_application_id },
      select: { appointment_reschedule_count: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    if (app.appointment_reschedule_count >= 3)
      throw new BadRequestException('Reschedule limit reached');

    const available = await this.isAvailable(
      current.employee_id,
      dto.scheduled_date,
      dto.slot_id,
    );
    if (!available)
      throw new BadRequestException('Selected slot is no longer available');

    const newDate = new Date(dto.scheduled_date);

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.titleDeedApplicationAppointment.create({
        data: {
          title_deed_application_id: current.title_deed_application_id,
          employee_id: current.employee_id,
          scheduled_date: newDate,
          slot_id: dto.slot_id,
        },
      });
      await tx.titleDeedApplicationAppointment.delete({
        where: { id: current.id },
      });
      await tx.titleDeedApplication.update({
        where: { id: current.title_deed_application_id },
        data: { appointment_reschedule_count: { increment: 1 } },
      });
      return created;
    });
  }

  async setOffDays(dto: SetOffDayDto) {
    const date = new Date(dto.date);
    const values = dto.slot_ids.map((slotId) => ({
      employee_id: dto.employee_id,
      date,
      slot_id: slotId,
    }));

    for (const value of values) {
      // emulate upsert on composite unique
      await this.prisma.employeeOffSlot
        .create({ data: value })
        .catch(async () => {
          // ignore duplicates
          return null;
        });
    }

    // list conflicting bookings for manual reschedule
    const conflicts =
      await this.prisma.titleDeedApplicationAppointment.findMany({
        where: {
          employee_id: dto.employee_id,
          scheduled_date: date,
          slot_id: { in: dto.slot_ids },
        },
      });

    return { success: true, conflicts };
  }
}
