import { Optional } from '@nestjs/common';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/global.dto';
export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

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

export class SearchRoleDto extends PartialType(PaginationDto) {
  @ApiProperty()
  @Optional()
  search?: string;
}
