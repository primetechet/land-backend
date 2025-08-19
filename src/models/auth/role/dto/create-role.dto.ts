import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;
  22;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  editable: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  switchable: boolean;

  @IsOptional()
  @ApiProperty({ type: () => CreateRolePermissionResourceDto }) // Specify nested DTO type
  rolePermissionResources: CreateRolePermissionResourceDto[];
}

export class CreateRolePermissionResourceDto {
  @ApiProperty({ description: 'The ID of the permission action' })
  @IsNotEmpty()
  permission_resource_id: string;

  @ApiProperty({ type: () => CreateRolePermissionResourceActionDto }) // Specify nested DTO type
  @IsOptional()
  rolePermissionResourceActions: CreateRolePermissionResourceActionDto[];
}

export class CreateRolePermissionResourceActionDto {
  @ApiProperty()
  @IsNotEmpty()
  permission_action_id: string;
}
