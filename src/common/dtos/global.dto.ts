import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { searchValueType, VariableProperties } from '../types/index.type';

enum SortDirection {
  DES = 'DES',
  ASC = 'ASC',
}
export class PaginationDto {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  page?: number = 1;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  limit?: number = 10;

  properties?: VariableProperties<searchValueType>;
  sorting?: VariableProperties<string>;

  @IsOptional()
  sort_by: string = 'created_at';

  @IsEnum(SortDirection, {
    message: 'sort_direction must be either DES or ASC',
  })
  @IsOptional()
  sort_direction?: SortDirection = SortDirection.DES;
}
