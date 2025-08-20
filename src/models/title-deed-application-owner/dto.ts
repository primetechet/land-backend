import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, IdType } from '@prisma/client';

export class CreateTitleDeedApplicationOwnerDto {
  @ApiProperty({
    description: 'Whether the owner is an organization',
    example: false,
  })
  @IsBoolean()
  is_organization: boolean;

  @ApiProperty({ description: 'ID type of the owner', enum: IdType })
  @IsEnum(IdType)
  id_type: IdType;

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

  @ApiProperty({ description: 'ID number of the owner', example: 'AB123456' })
  @IsString()
  id_number: string;

  @ApiProperty({
    description: 'Indicates if the owner is also the applicant',
    example: true,
  })
  @IsBoolean()
  is_applicant: boolean;

  @ApiProperty({ description: 'First name of the owner', example: 'John' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Father name of the owner', example: 'Doe' })
  @IsString()
  father_name: string;

  @ApiProperty({
    description: 'Grandfather name of the owner',
    example: 'Smith',
  })
  @IsString()
  grand_father_name: string;

  @ApiProperty({ description: 'First name in Amharic', example: 'ጆን' })
  @IsString()
  first_name_am: string;

  @ApiProperty({ description: 'Father name in Amharic', example: 'ዶ' })
  @IsString()
  father_name_am: string;

  @ApiProperty({ description: 'Grandfather name in Amharic', example: 'ስሚት' })
  @IsString()
  grand_father_name_am: string;

  @ApiProperty({ description: 'Mother first name', example: 'Anna' })
  @IsString()
  mother_first_name: string;

  @ApiProperty({ description: 'Mother father name', example: 'Williams' })
  @IsString()
  mother_father_name: string;

  @ApiProperty({ description: 'Mother grandfather name', example: 'Brown' })
  @IsString()
  mother_grand_father_name: string;

  @ApiProperty({ description: 'Mother first name in Amharic', example: 'አና' })
  @IsString()
  mother_first_name_am: string;

  @ApiProperty({
    description: 'Mother father name in Amharic',
    example: 'ዊሊያምስ',
  })
  @IsString()
  mother_father_name_am: string;

  @ApiProperty({
    description: 'Mother grandfather name in Amharic',
    example: 'ብራውን',
  })
  @IsString()
  mother_grand_father_name_am: string;

  @ApiProperty({ description: 'Gender of the owner', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'Kebele of the owner', example: 'Kebele 10' })
  @IsString()
  kebele: string;

  @ApiProperty({ description: 'House number of the owner', example: 'H-12' })
  @IsString()
  house_number: string;

  @ApiProperty({
    description: 'Linked Title Deed Application ID',
    example: 'uuid-of-application',
  })
  @IsString()
  title_deed_application_id: string;

  @ApiProperty({
    description: 'Disability status ID',
    example: 'uuid-of-disability-status',
  })
  @IsString()
  disability_status_id: string;

  @ApiProperty({ description: 'Nationality ID', example: 'uuid-of-country' })
  @IsString()
  nationality_id: string;

  @ApiProperty({
    description: 'Residency Country ID',
    example: 'uuid-of-country',
  })
  @IsString()
  residency_country_id: string;

  @ApiProperty({ description: 'Woreda ID', example: 'uuid-of-woreda' })
  @IsString()
  woreda_id: string;

  @ApiPropertyOptional({
    description: 'Remark about the owner',
    example: 'Owner is abroad',
  })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class SearchTitleDeedApplicationOwnerDto extends PartialType(
  PaginationDto,
) {
  search?: string;
}

export class UpdateTitleDeedApplicationOwnerDto extends PartialType(
  CreateTitleDeedApplicationOwnerDto,
) {
  updated_by_id: string;
}
