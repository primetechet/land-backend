import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';
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

  @ApiPropertyOptional({
    description: 'Whether the country is in draft mode',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchDisabilityStatusDto extends PartialType(PaginationDto) {
  search?: string;
}

export class UpdateDisabilityStatusDto extends PartialType(
  CreateDisabilityStatusDto,
) {}
