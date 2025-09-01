import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class GetOptionsDto {
  @ApiProperty({
    description:
      'ID of the title deed application to get appointment options for',
    example: '8a8d8d73-ab77-4995-99f9-db5b27ae607e',
  })
  @IsString()
  title_deed_application_id: string;
}

export class BookDto {
  @ApiProperty({
    description: 'ID of the title deed application to book appointment for',
    example: '8a8d8d73-ab77-4995-99f9-db5b27ae607e',
  })
  @IsString()
  title_deed_application_id: string;

  @ApiProperty({
    description: 'Date for the appointment in YYYY-MM-DD format',
    example: '2024-09-15',
  })
  @IsDateString()
  scheduled_date: string;

  @ApiProperty({
    description:
      'ID of the time slot for the appointment (Morning 1: 09:00-10:00, Morning 2: 10:00-11:00, Afternoon 1: 14:00-15:00, Afternoon 2: 15:00-16:00)',
    example: 'c7e0e1d2-38bf-42d6-82ef-c06a48cbd539',
  })
  @IsString()
  slot_id: string;
}

export class RescheduleDto {
  @ApiProperty({
    description:
      'ID of the existing appointment to reschedule (optional if title_deed_application_id is provided)',
    example: '1c942126-f7d8-43e5-ba63-997ec861f39a',
    required: false,
  })
  @IsOptional()
  @IsString()
  appointment_id?: string;

  @ApiProperty({
    description:
      'ID of the title deed application (optional if appointment_id is provided)',
    example: '8a8d8d73-ab77-4995-99f9-db5b27ae607e',
    required: false,
  })
  @IsOptional()
  @IsString()
  title_deed_application_id?: string;

  @ApiProperty({
    description: 'New date for the appointment in YYYY-MM-DD format',
    example: '2024-09-20',
  })
  @IsDateString()
  scheduled_date: string;

  @ApiProperty({
    description:
      'ID of the new time slot for the appointment (Morning 1: 09:00-10:00, Morning 2: 10:00-11:00, Afternoon 1: 14:00-15:00, Afternoon 2: 15:00-16:00)',
    example: '4ab03482-72c2-46d3-a556-dd8b486d1f2f',
  })
  @IsString()
  slot_id: string;
}

export class SetOffDayDto {
  @ApiProperty({
    description: 'ID of the employee to set off days for',
    example: 'e5f8a9b2-3c4d-4e5f-6789-012345abcdef',
  })
  @IsString()
  employee_id: string;

  @ApiProperty({
    description: 'Date to set as off day in YYYY-MM-DD format',
    example: '2024-09-18',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description:
      'Array of slot IDs to mark as unavailable (1-4 slots: Morning 1, Morning 2, Afternoon 1, Afternoon 2)',
    example: [
      'c7e0e1d2-38bf-42d6-82ef-c06a48cbd539',
      '4ab03482-72c2-46d3-a556-dd8b486d1f2f',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  slot_ids: string[];
}
