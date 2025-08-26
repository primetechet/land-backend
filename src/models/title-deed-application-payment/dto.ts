import { PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentReason {
  APPLICATION_FEE = 'APPLICATION_FEE',
  PENALTY = 'PENALTY',
  TAX = 'TAX',
  OTHER = 'OTHER',
}

export class CreatePaymentDto {
  @ApiProperty({ description: 'Payment amount', example: 2500 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Reason for payment', enum: PaymentReason })
  @IsEnum(PaymentReason)
  payment_reason: PaymentReason;

  @ApiProperty({ description: 'Associated title deed application ID' })
  @IsString()
  title_deed_application_id: string;

  @ApiPropertyOptional({
    description: 'Optional remark',
    example: 'Penalty for late submission',
  })
  @IsOptional()
  @IsString()
  remark?: string;

  created_by_id: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  updated_by_id: string;
}

export class MarkPaymentPaidDto {
  @ApiProperty({ description: 'Whether the payment is paid', example: true })
  @IsBoolean()
  paid: boolean;

  @ApiPropertyOptional({ description: 'User who marked the payment as paid' })
  @IsOptional()
  @IsString()
  paid_by_id?: string;
}
