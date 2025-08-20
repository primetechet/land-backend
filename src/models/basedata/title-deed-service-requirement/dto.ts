import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTitleDeedServiceRequirementDto {
  @ApiPropertyOptional({ description: 'Requirement description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Localized descriptions as JSON',
    example: {
      en: 'Original ID Card',
      am: 'የመንግስት መታወቂያ ካርድ ዋና ቅጂ',
    },
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiProperty({
    description: 'Title deed service ID',
    example: 'uuid-of-service',
  })
  @IsString()
  title_deed_service_id: string;

  created_by_id: string;
}

export class SearchTitleDeedServiceRequirementDto extends PartialType(
  PaginationDto,
) {
  @ApiPropertyOptional({
    description: 'Search by description',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateTitleDeedServiceRequirementDto extends PartialType(
  CreateTitleDeedServiceRequirementDto,
) {
  updated_by_id: string;
}
