import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlotPropertyDto {
  @ApiProperty({ description: 'Number of basement floors', example: '2' })
  @IsString()
  basement_floor_number: string;

  @ApiProperty({ description: 'Number of upper floors', example: '5' })
  @IsString()
  upper_floor_number: string;

  @ApiProperty({ description: 'Building number', example: 'B-12' })
  @IsString()
  building_number: string;

  @ApiProperty({ description: 'House number', example: 'H-202' })
  @IsString()
  house_number: string;

  @ApiProperty({ description: 'Floor number', example: '3' })
  @IsString()
  floor_number: string;

  @ApiProperty({ description: 'Estimated property price', example: 250000.5 })
  @IsNumber()
  estimated_price: number;

  @ApiProperty({ description: 'Total area in square meters', example: 350.5 })
  @IsNumber()
  area_meter_square: number;

  @ApiProperty({ description: 'Parking area in square meters', example: 50 })
  @IsNumber()
  parking_area_meter_square: number;

  @ApiProperty({ description: 'Building size in square meters', example: 300 })
  @IsNumber()
  building_size_meter_square: number;

  @ApiProperty({ description: 'Number of lifts', example: 2 })
  @IsNumber()
  number_of_lift: number;

  @ApiPropertyOptional({ description: 'Remarks about the property' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: 'Plot ID (FK)' })
  @IsUUID()
  plot_id: string;

  @ApiProperty({ description: 'Property use ID (FK)' })
  @IsUUID()
  property_use_id: string;

  @ApiProperty({ description: 'Property type ID (FK)' })
  @IsUUID()
  property_type_id: string;

  created_by_id: string;
}

export class SearchPlotPropertyDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({
    description: 'Search by building, house, or property id',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by plot ID' })
  @IsOptional()
  @IsUUID()
  plot_id?: string;

  @ApiPropertyOptional({ description: 'Filter by property type ID' })
  @IsOptional()
  @IsUUID()
  property_type_id?: string;

  @ApiPropertyOptional({ description: 'Filter by property use ID' })
  @IsOptional()
  @IsUUID()
  property_use_id?: string;
}

export class UpdatePlotPropertyDto extends PartialType(CreatePlotPropertyDto) {
  updated_by_id: string;
}

export class ApprovePlotPropertyDto {
  @ApiProperty({ description: 'Approval status', example: true })
  @IsBoolean()
  approved: boolean;

  @ApiPropertyOptional({ description: 'Approver note' })
  @IsOptional()
  @IsString()
  note?: string;

  updated_by_id: string;
}
