import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTitleDeedApplicationDto {
  @ApiProperty({
    description: 'Whether the applicant is an organization',
    example: false,
  })
  @IsBoolean()
  is_organization: boolean;

  @ApiProperty({ description: 'Unique title deed number', example: 'TD-12345' })
  @IsString()
  @IsOptional()
  title_deed_number: string;

  @ApiProperty({ description: 'Kebele of the applicant', example: 'Kebele 12' })
  @IsString()
  kebele: string;

  @ApiProperty({
    description: 'Phone number of the applicant',
    example: '+251912345678',
  })
  @IsString()
  phone_number: string;

  @ApiPropertyOptional({
    description: 'Birth date of the applicant',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsString()
  birth_date?: string;
  @ApiProperty({ description: 'House number', example: 'H-123' })
  @IsString()
  house_number: string;

  @ApiPropertyOptional({
    description: 'Additional remark about the application',
    example: 'Urgent processing required',
  })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({
    description: 'Related Title Deed Service ID',
    example: 'uuid-of-service',
  })
  @IsString()
  title_deed_service_id: string;

  @ApiPropertyOptional({
    description: 'Organization Type ID (if applicable)',
    example: 'uuid-of-org-type',
  })
  @IsOptional()
  @IsString()
  organization_type_id?: string;

  @ApiProperty({ description: 'Woreda ID', example: 'uuid-of-woreda' })
  @IsString()
  woreda_id: string;

  @ApiProperty({ description: 'Branch ID', example: 'uuid-of-branch' })
  @IsString()
  branch_id: string;
}

export class SearchTitleDeedApplicationDto extends PartialType(PaginationDto) {
  search?: string;
}

export class UpdateTitleDeedApplicationDto extends PartialType(
  CreateTitleDeedApplicationDto,
) {
  updated_by_id: string;
}
