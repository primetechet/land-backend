import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropertyTypeDto {
  @ApiProperty({ description: 'Property type name', example: 'Residential' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Property type name translations',
    example: { en: 'Residential', am: 'መኖሪያ' },
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description of the property type',
    example: 'Properties used for housing purposes',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Description in JSON (multi-language)',
    example: { en: 'Residential property', am: 'የመኖሪያ ንብረት' },
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Draft status', example: false })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchPropertyTypeDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Search by name or description' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdatePropertyTypeDto extends PartialType(CreatePropertyTypeDto) {}
