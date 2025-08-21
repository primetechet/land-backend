import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { APPLICANT_TYPE } from '@prisma/client';

export class CreateTitleDeedServiceDto {
  @ApiProperty({
    description: 'The name of the title deed service',
    example: 'Ownership Transfer',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: { en: 'Ownership Transfer', fr: 'Transfert de propriété' },
    description: 'Name in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Icon as JSON metadata (URL, SVG, etc.)',
    example: { url: '/icons/transfer.svg' },
  })
  @IsOptional()
  @IsObject()
  icon?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Description of the service',
    example: 'A service for transferring ownership of land/property',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: {
      en: 'A service for transferring ownership',
      fr: 'Un service de transfert de propriété',
    },
    description: 'Description in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiProperty({
    description: 'Indicates if this service requires an existing title deed',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  has_existing_title_deed?: boolean;

  @ApiProperty({
    description: 'Indicates if this service requires an existing title deed',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  individual_only?: boolean;

  @ApiPropertyOptional({
    description: 'The ID of the parent title deed service (if nested)',
    example: 'uuid-of-parent-service',
  })
  @IsOptional()
  @IsString()
  parent_title_deed_service_id?: string;

  @ApiProperty({ description: 'The country code', example: 'US' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Applicant Type', enum: APPLICANT_TYPE })
  @IsEnum(APPLICANT_TYPE)
  applicant_type: APPLICANT_TYPE;

  @ApiPropertyOptional({
    description: 'Whether the country is in draft mode',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchTitleDeedServiceDto extends PartialType(PaginationDto) {
  search?: string;
  title_deed_service_id?: string;
  branch_id?: string;
}

export class UpdateTitleDeedServiceDto extends PartialType(
  CreateTitleDeedServiceDto,
) {
  updated_by_id: string;
}
