import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/global.dto';

export class CreatePermissionResourceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;
}

export class SearchPermissionResourceDto extends PartialType(PaginationDto) {
  search?: string;
}
