import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDisabilityStatusDto {
  @ApiProperty({
    description: 'The name of the disability status',
    example: 'Blind',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: { en: 'Blind', am: 'ዐይነ-ስውር' },
    description: 'Name in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  name_json: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Description of the disability status',
    example: 'Person with visual impairment',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: { en: 'Visual impairment', am: 'የእይታ ችግር' },
    description: 'Description in different languages as JSON',
  })
  @IsOptional()
  @IsObject()
  description_json?: Record<string, string>;

  created_by_id: string;
}

export class SearchDisabilityStatusDto extends PartialType(PaginationDto) {
  search?: string;
}

export class UpdateDisabilityStatusDto extends PartialType(
  CreateDisabilityStatusDto,
) {
  updated_by_id: string;
}
