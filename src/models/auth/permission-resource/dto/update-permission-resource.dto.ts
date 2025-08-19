import { PartialType } from '@nestjs/swagger';
import { CreatePermissionResourceDto } from './create-permission-resource.dto';

export class UpdatePermissionResourceDto extends PartialType(
  CreatePermissionResourceDto,
) {}
