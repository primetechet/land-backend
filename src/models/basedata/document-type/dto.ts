import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentTypeDto {
  @ApiProperty({ description: 'Unique name of the document type' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Unique code for the document type' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'Size of document in MB', default: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  size?: number;

  @ApiPropertyOptional({
    description: 'Minimum number of documents required',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  min_document_count?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of documents allowed',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_document_count?: number;

  @ApiPropertyOptional({ description: 'Description of the document type' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Name in different languages',
    example: { en: 'Passport', am: 'ፓስፖርት' },
  })
  @IsOptional()
  @IsObject()
  name_json?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description in different languages',
    example: { en: 'National passport document', am: 'የአገር ፓስፖርት ሰነድ' },
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Allowed file types',
    example: { types: ['jpg', 'png', 'pdf'] },
  })
  @IsOptional()
  @IsObject()
  allowed_file_types?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Check hint for validation' })
  @IsOptional()
  @IsString()
  check_hint?: string;

  @ApiPropertyOptional({
    description: 'Whether the document expires',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  expires?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the country is in draft mode',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchDocumentTypeDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Search by name or code' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateDocumentTypeDto extends PartialType(CreateDocumentTypeDto) {
  updated_by_id: string;
}
