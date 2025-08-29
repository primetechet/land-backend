import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRejectionReasonDto {
  @ApiProperty({
    description: 'Rejection reason name',
    example: 'Incomplete Documents',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Localized names',
    example: { en: 'Incomplete Documents', am: 'ያልተሟላ ሰነዶች' },
  })
  @IsOptional()
  @IsObject()
  name_json?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description of the rejection reason',
    example: 'Applicant did not submit all required documents',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Localized descriptions',
    example: { en: 'Missing docs', am: 'ሰነዶች የሉም' },
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Draft status', example: false })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchRejectionReasonDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Search by name or description' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateRejectionReasonDto extends PartialType(
  CreateRejectionReasonDto,
) {}
