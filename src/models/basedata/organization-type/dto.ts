import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';

export class CreateOrganizationTypeDto {
  @ApiProperty({
    description: 'The name of the organization type',
    example: 'Private Limited Company',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: { en: 'Private Limited Company', am: 'የግል ድርጅት' },
    description: 'Name in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description of the organization type',
    example: 'This type represents private limited companies.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: {
      en: 'Private Limited Company',
      am: 'የግል ድርጅት',
    },
    description: 'Description in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  created_by_id: string;
}

export class SearchOrganizationTypeDto extends PartialType(PaginationDto) {
  search?: string;
}

export class UpdateOrganizationTypeDto extends PartialType(
  CreateOrganizationTypeDto,
) {
  updated_by_id: string;
}
