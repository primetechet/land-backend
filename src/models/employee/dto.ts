import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { PaginationDto } from 'src/common/dtos/global.dto';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Yoseph Hailu' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  accept_abroad_request: boolean;

  @ApiProperty({
    example: '+251923760796',
  })
  @Matches(/^\+251[97][0-9]{8}$/, {
    message:
      'Phone string must start with +251, followed by 9 or 7, and then 8 digits.',
  })
  @IsNotEmpty({ message: 'Phone string is required.' })
  phone_number: string;

  @ApiProperty({
    example: 'landadmin',
  })
  @IsNotEmpty({ message: 'username is required.' })
  username: string;

  @ApiProperty({ example: 'Password123' })
  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one letter and one string.',
  })
  password: string;

  @ApiProperty({ example: 'Role Id' })
  @IsNotEmpty()
  role_id: string;

  @ApiProperty({ example: 'Branch Id' })
  @IsOptional()
  branch_id: string;
}

export class SearchEmployeeDto extends PartialType(PaginationDto) {
  search?: string;
  department_role_id?: string;
  department_id?: string;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  updated_by_id: string;
}
