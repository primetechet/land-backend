import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlotDto {
  @ApiProperty({
    description: 'Geometry polygon in WKT or GeoJSON format',
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [39.123, 9.123],
          [39.124, 9.123],
          [39.124, 9.124],
          [39.123, 9.124],
          [39.123, 9.123],
        ],
      ],
    },
  })
  @IsObject()
  polygon: any; // you may validate GeoJSON separately

  @ApiProperty({ description: 'Block number', example: 'B12' })
  @IsString()
  block_number: string;

  @ApiProperty({ description: 'House number', example: 'H45' })
  @IsString()
  house_number: string;

  @ApiProperty({ description: 'Area in square meters', example: 350.75 })
  @IsNumber()
  area_meter_square: number;

  @ApiPropertyOptional({ description: 'Remark or notes about plot' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: 'Title deed application ID' })
  @IsUUID()
  title_deed_application_id: string;

  @ApiProperty({ description: 'Land use ID' })
  @IsUUID()
  land_use_id: string;

  @ApiProperty({ description: 'Land grade ID' })
  @IsUUID()
  land_grade_id: string;
}

export class SearchPlotDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({
    description: 'Search by block, house number, or plot id',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by branch ID' })
  @IsOptional()
  @IsUUID()
  branch_id?: string;

  @ApiPropertyOptional({ description: 'Filter by woreda ID' })
  @IsOptional()
  @IsUUID()
  woreda_id?: string;

  @ApiPropertyOptional({ description: 'Filter by land use ID' })
  @IsOptional()
  @IsUUID()
  land_use_id?: string;

  @ApiPropertyOptional({ description: 'Filter by land grade ID' })
  @IsOptional()
  @IsUUID()
  land_grade_id?: string;
}

export class UpdatePlotDto extends PartialType(CreatePlotDto) {
  updated_by_id: string;
}
