import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ACTIONS } from 'src/common/constants/actions';
import { PaginationDto } from 'src/common/dtos/global.dto';

export class CreatePermissionActionDto {
  @ApiProperty({
    example: ACTIONS.CREATE,
  })
  @IsNotEmpty()
  action: string;

  @ApiProperty()
  description: string;
}

export class SearchPermissionActionDto extends PartialType(PaginationDto) {
  search?: string;
}
