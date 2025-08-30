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
    example: '8a8d8d73-ab77-4995-99f9-db5b27ae607e',
  })
  @IsString()
  title_deed_service_id: string;

  @ApiPropertyOptional({
    description: 'Organization Type ID (required for organizations)',
    example: '1c942126-f7d8-43e5-ba63-997ec861f39a',
  })
  @IsOptional()
  @IsString()
  organization_type_id?: string;

  @ApiProperty({
    description: 'Woreda ID',
    example: 'c7e0e1d2-38bf-42d6-82ef-c06a48cbd539',
  })
  @IsString()
  woreda_id: string;

  @ApiProperty({
    description: 'Branch ID',
    example: '4ab03482-72c2-46d3-a556-dd8b486d1f2f',
  })
  @IsString()
  branch_id: string;
}

export class SearchTitleDeedApplicationDto extends PartialType(PaginationDto) {
  @IsOptional()
  search?: string;

  @IsOptional()
  user_id?: string;
}

export class UpdateTitleDeedApplicationDto extends PartialType(
  CreateTitleDeedApplicationDto,
) {}
