import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDistrictDto {
  @ApiProperty({
    description: 'The name of the district',
    example: 'Los Angeles',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: { en: 'Los Angeles', fr: 'Los Angeles' },
    description: 'Name in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description of the district',
    example: 'A major city in California.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: {
      en: 'A major city in California.',
      fr: 'Une grande ville en Californie.',
    },
    description: 'Description in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiProperty({
    description: 'The ID of the region this district belongs to',
    example: 'uuid-of-region',
  })
  @IsString()
  region_id: string;

  @ApiProperty({
    description: 'The zip code of the district',
    example: '90001',
  })
  @IsString()
  zip_code: string;

  created_by_id: string;
}

export class SearchDistrictDto extends PartialType(PaginationDto) {
  search?: string;
  region_id?: string;
}

export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {
  updated_by_id: string;
}
