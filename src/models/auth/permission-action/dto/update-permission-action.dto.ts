import { PartialType } from '@nestjs/swagger';
import { CreatePermissionActionDto } from './create-permission-action.dto';

export class UpdatePermissionActionDto extends PartialType(
  CreatePermissionActionDto,
) {}
