import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    description: 'The name of the country',
    example: 'United States',
  })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The country code', example: 'US' })
  @IsString()
  country_code: string;

  @ApiProperty({
    description: 'The nationality of the country',
    example: 'American',
  })
  @IsString()
  nationality: string;

  @ApiProperty({
    example: { en: 'Service', fr: 'Service' },
    description: 'Name in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiProperty({
    example: { en: 'Service', fr: 'Service' },
    description: 'Name in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  nationality_json: Record<string, string>;

  @ApiProperty({
    example: { en: 'Service', fr: 'Service' },
    description: 'Name in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  description_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'The flag of the country',
    example: '🇺🇸',
  })
  @IsOptional()
  @IsString()
  flag?: string;

  @ApiPropertyOptional({
    description: 'Description of the country',
    example: 'A country in North America.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the country is in draft mode',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchCountryDto extends PartialType(PaginationDto) {
  search?: string;
  has_branch?: string;
  accept_passport?: String;
  accept_origin_id?: String;
  accept_residency?: String;
  accept_visa?: String;
  is_neighbor?: String;
}

export class UpdateCountryDto extends PartialType(CreateCountryDto) {}
