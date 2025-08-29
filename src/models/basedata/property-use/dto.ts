import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropertyUseDto {
  @ApiProperty({ description: 'Property use name', example: 'Commercial' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Property use name translations',
    example: { en: 'Commercial', am: 'ንግድ' },
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description of the property use',
    example: 'Properties used for business activities',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Description in JSON (multi-language)',
    example: { en: 'Commercial property use', am: 'የንግድ ንብረት አጠቃቀም' },
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Draft status', example: false })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchPropertyUseDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'Search by name or description' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdatePropertyUseDto extends PartialType(CreatePropertyUseDto) {}
