import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLandUseDto {
  @ApiProperty({ description: 'Land use name', example: 'Residential' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Land use name translations',
    example: { en: 'Residential', am: 'መኖሪያ' },
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description of the land use',
    example: 'Land designated for residential housing',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Description in JSON (multi-language)',
    example: { en: 'Residential housing area', am: 'የመኖሪያ ቤት አካባቢ' },
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Draft status', example: false })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchLandUseDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Search by name or description' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateLandUseDto extends PartialType(CreateLandUseDto) {}
