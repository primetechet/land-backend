import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLandGradeDto {
  @ApiProperty({ description: 'Land grade name', example: 'First Grade' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Land grade name translations',
    example: { en: 'First Grade', am: 'መጀመሪያ ደረጃ' },
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description of the land grade',
    example: 'High quality land grade for residential areas',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Description in JSON (multi-language)',
    example: { en: 'Residential grade', am: 'የመኖሪያ ደረጃ' },
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Draft status', example: false })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchLandGradeDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Search by name or description' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateLandGradeDto extends PartialType(CreateLandGradeDto) {}
