import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { ACTIONS } from 'src/common/constants/actions';
import { PaginationDto } from 'src/common/dtos/global.dto';

export class CreatePermissionActionDto {
  @ApiProperty({
    example: ACTIONS.CREATE,
  })
  @IsNotEmpty()
  action: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    description: 'Whether the country is in draft mode',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}

export class SearchPermissionActionDto extends PartialType(PaginationDto) {
  @ApiProperty()
  @IsOptional()
  search?: string;
}
