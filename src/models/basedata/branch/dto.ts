import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BranchType } from '@prisma/client';

export class CreateBranchDto {
  @ApiProperty({ description: 'Branch name', example: 'Addis Ababa Central' })
  @IsString()
  name: string;

  @ApiProperty({
    example: { en: 'Addis Ababa Central', am: 'አዲስ አበባ ማዕከላዊ' },
    description: 'Branch name translations in JSON',
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiProperty({ description: 'Branch code', example: 'BR001' })
  @IsString()
  code: string;

  @ApiPropertyOptional({
    description: 'Description of the branch',
    example: 'This is the central branch of Addis Ababa.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: {
      en: 'This is the central branch of Addis Ababa.',
      am: 'ይህ የአዲስ አበባ ማዕከላዊ ቅርንጫፍ ነው።',
    },
    description: 'Description in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiProperty({
    description: 'Woreda ID of the branch',
    example: 'uuid-of-woreda',
  })
  @IsString()
  woreda_id: string;

  @ApiProperty({ description: 'Branch Type', enum: BranchType })
  @IsEnum(BranchType)
  branch_type: BranchType;

  @ApiPropertyOptional({
    description: 'Whether the country is in draft mode',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchBranchDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Search term for branch name or code' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  updated_by_id: string;
}
