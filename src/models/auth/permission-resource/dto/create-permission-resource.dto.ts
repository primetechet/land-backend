import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/global.dto';

export class CreatePermissionResourceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

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

export class SearchPermissionResourceDto extends PartialType(PaginationDto) {
  search?: string;
}
