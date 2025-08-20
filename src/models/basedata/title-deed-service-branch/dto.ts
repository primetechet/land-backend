import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTitleDeedServiceBranchDto {
  @ApiPropertyOptional({ description: 'Branch service description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Localized description in JSON',
    example: { en: 'Service description', am: 'የአገልግሎት መግለጫ' },
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiProperty({ description: 'Branch ID', example: 'uuid-of-branch' })
  @IsString()
  branch_id: string;

  @ApiProperty({
    description: 'Title deed service ID',
    example: 'uuid-of-service',
  })
  @IsString()
  title_deed_service_id: string;

  created_by_id: string;
}

export class SearchTitleDeedServiceBranchDto extends PartialType(
  PaginationDto,
) {
  @ApiPropertyOptional({ description: 'Search term for description' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateTitleDeedServiceBranchDto extends PartialType(
  CreateTitleDeedServiceBranchDto,
) {
  updated_by_id: string;
}
