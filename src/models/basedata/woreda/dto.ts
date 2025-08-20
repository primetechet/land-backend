import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWoredaDto {
  @ApiProperty({
    description: 'The name of the woreda',
    example: 'Bole',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: { en: 'Bole', am: 'ቦሌ' },
    description: 'Name in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description of the woreda',
    example: 'A sub-city in Addis Ababa.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: { en: 'Sub-city in Addis Ababa', am: 'በአዲስ አበባ ከተማ አካባቢ' },
    description: 'Description in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiProperty({
    description: 'The ID of the district this woreda belongs to',
    example: 'uuid-of-district',
  })
  @IsString()
  district_id: string;

  @ApiProperty({
    description: 'The zip code of the woreda',
    example: '1000',
  })
  @IsString()
  zip_code: string;

  created_by_id: string;
}

export class SearchWoredaDto extends PartialType(PaginationDto) {
  search?: string;
}

export class UpdateWoredaDto extends PartialType(CreateWoredaDto) {
  updated_by_id: string;
}
