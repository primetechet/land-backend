import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty({
    description: 'The name of the region',
    example: 'California',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: { en: 'California', fr: 'Californie' },
    description: 'Name in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiProperty({
    description: 'The zip code of the region',
    example: '90000',
  })
  @IsString()
  zip_code: string;

  @ApiPropertyOptional({
    description: 'Description of the region',
    example: 'A region in the USA.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: {
      en: 'A region in the USA.',
      fr: 'Une région aux États-Unis.',
    },
    description: 'Description in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiProperty({
    description: 'The ID of the country this region belongs to',
    example: 'uuid-of-country',
  })
  @IsString()
  country_id: string;

  created_by_id: string;
}

export class SearchRegionDto extends PartialType(PaginationDto) {
  search?: string;
}

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  updated_by_id: string;
}
