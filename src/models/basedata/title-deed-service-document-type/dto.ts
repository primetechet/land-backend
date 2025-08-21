import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTitleDeedServiceDocumentTypeDto {
  @ApiProperty({ description: 'Title deed service ID' })
  @IsString()
  title_deed_service_id: string;

  @ApiProperty({ description: 'Document type ID' })
  @IsString()
  document_type_id: string;

  @ApiPropertyOptional({
    description: 'Custom properties for the document type',
    example: { maxPages: 5, format: 'pdf' },
  })
  @IsOptional()
  @IsObject()
  properties_json?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Description of the service document type',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the document is required',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_required?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the country is in draft mode',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchTitleDeedServiceDocumentTypeDto extends PartialType(
  PaginationDto,
) {
  @ApiPropertyOptional({ description: 'Search by description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by title deed service ID' })
  @IsOptional()
  @IsString()
  title_deed_service_id?: string;

  @ApiPropertyOptional({ description: 'Filter by document type ID' })
  @IsOptional()
  @IsString()
  document_type_id?: string;
}

export class UpdateTitleDeedServiceDocumentTypeDto extends PartialType(
  CreateTitleDeedServiceDocumentTypeDto,
) {
  updated_by_id: string;
}
