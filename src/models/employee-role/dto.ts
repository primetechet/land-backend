import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/global.dto';

export class CreateEmployeeRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  employee_id: string;

  @ApiProperty()
  @IsNotEmpty()
  role_id: string;
}

export class SearchEmployeeRoleDto extends PartialType(PaginationDto) {}
