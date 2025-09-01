import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/global.dto';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsBoolean,
  IsObject,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlotDto {
  @ApiProperty({
    description: 'Plot Id from archGis desktop',
    example: 'ARD-123123213',
  })
  @IsString()
  plot_id: string;

  @ApiProperty({ description: 'Title deed application ID' })
  @IsUUID()
  title_deed_application_id: string;
}

export class CreateBaseMapDto {
  @ApiProperty({
    description: 'Base map id from archGis desktop',
    example: 'ARD-123123213',
  })
  @IsString()
  base_map_id: string;
}

// export class CreatePlotDto {
//   @ApiProperty({
//     description: 'Geometry polygon in WKT or GeoJSON format',
//     example: {
//       type: 'Polygon',
//       coordinates: [
//         [
//           [39.123, 9.123],
//           [39.124, 9.123],
//           [39.124, 9.124],
//           [39.123, 9.124],
//           [39.123, 9.123],
//         ],
//       ],
//     },
//   })
//   @IsObject()
//   polygon: any; // you may validate GeoJSON separately

//   @ApiProperty({ description: 'Block number', example: 'B12' })
//   @IsString()
//   block_number: string;

//   @ApiProperty({ description: 'House number', example: 'H45' })
//   @IsString()
//   house_number: string;

//   @ApiProperty({ description: 'Area in square meters', example: 350.75 })
//   @IsNumber()
//   area_meter_square: number;

//   @ApiPropertyOptional({ description: 'Remark or notes about plot' })
//   @IsOptional()
//   @IsString()
//   remark?: string;

//   @ApiProperty({ description: 'Title deed application ID' })
//   @IsUUID()
//   title_deed_application_id: string;

//   @ApiProperty({ description: 'Land use ID' })
//   @IsUUID()
//   land_use_id: string;

//   @ApiProperty({ description: 'Land grade ID' })
//   @IsUUID()
//   land_grade_id: string;
// }

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

export class SpatialQueryDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({
    description:
      'Point coordinates [longitude, latitude] for point-in-polygon queries',
    example: [39.123, 9.123],
  })
  @IsOptional()
  point?: [number, number];

  @ApiPropertyOptional({
    description:
      'Bounding box [minLng, minLat, maxLng, maxLat] for viewport queries',
    example: [39.1, 9.1, 39.2, 9.2],
  })
  @IsOptional()
  bbox?: [number, number, number, number];

  @ApiPropertyOptional({
    description: 'Buffer distance in meters for spatial queries',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  buffer_distance?: number;

  @ApiPropertyOptional({
    description: 'Center point for buffer queries [longitude, latitude]',
    example: [39.123, 9.123],
  })
  @IsOptional()
  center?: [number, number];
}

export class GeometryValidationDto {
  @ApiProperty({
    description: 'ESRI geometry object with rings',
    example: {
      geometry: {
        rings: [
          [
            [474056.14609999955, 1030648.0333999991],
            [475607.62939999998, 1030492.8850999996],
            [474211.29440000001, 1029251.6984000001],
            [474056.14609999955, 1030648.0333999991],
          ],
        ],
      },
      spatialReference: { wkid: 20137 },
    },
  })
  @IsObject()
  geo: any;
}

export class ClientRejectPlotDto {
  @ApiProperty({ example: 'I don´t accept this map' })
  @IsOptional()
  client_rejection_note: string;
}

export class ClientConfirmationPlotDto {
  @ApiProperty({ example: 'I accept this map' })
  @IsOptional()
  client_confirmation_note: string;
}
