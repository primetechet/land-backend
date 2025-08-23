import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateRoleDto, SearchRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(data: CreateRoleDto): Promise<Role> {
    const role = await this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        switchable: data.switchable,
        editable: data.editable,
      },
    });

    data.rolePermissionResources.map(async (_rolePermissionResource) => {
      const rolePermissionResource =
        await this.prisma.rolePermissionResource.create({
          data: {
            role_id: role.id,
            permission_resource_id:
              _rolePermissionResource.permission_resource_id,
          },
        });

      _rolePermissionResource.rolePermissionResourceActions.map(
        async (_rolePermissionResourceAction) => {
          await this.prisma.rolePermissionResourceAction.create({
            data: {
              role_permission_resource_id: rolePermissionResource.id,
              permission_action_id:
                _rolePermissionResourceAction.permission_action_id,
            },
          });
        },
      );
    });
    return role;
  }

  async findAllPaginated(options: SearchRoleDto) {
    const { search } = options;
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return await paginate(
      this.prisma.role,
      {
        where,
      },
      { page: +options.page, perPage: +options.limit },
    );
  }

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    const role = await this.prisma.role.findUnique({ where: { id: id } });
    // if(!role.editable) {
    //   throw new HttpException('Role Is Not Editable', 500);
    // }

    await this.prisma.role.update({
      where: { id: id },
      data: {
        name: data.name,
        description: data.description,
        switchable: data.switchable,
        editable: data.editable,
      },
    });

    await this.prisma.rolePermissionResourceAction.deleteMany({
      where: {
        rolePermissionResource: {
          role_id: id,
        },
      },
    });

    await this.prisma.rolePermissionResource.deleteMany({
      where: {
        role_id: id,
      },
    });

    data.rolePermissionResources.map(async (_rolePermissionResource) => {
      const rolePermissionResource =
        await this.prisma.rolePermissionResource.create({
          data: {
            role_id: role.id,
            permission_resource_id:
              _rolePermissionResource.permission_resource_id,
          },
        });

      _rolePermissionResource.rolePermissionResourceActions.map(
        async (_rolePermissionResourceAction) => {
          await this.prisma.rolePermissionResourceAction.create({
            data: {
              role_permission_resource_id: rolePermissionResource.id,
              permission_action_id:
                _rolePermissionResourceAction.permission_action_id,
            },
          });
        },
      );
    });
    return role;
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id: id },
      include: {
        rolePermissionResources: {
          select: {
            id: true,
            permissionResource: {
              select: { id: true, name: true },
            },
            rolePermissionResourceActions: {
              select: {
                id: true,
                permissionAction: {
                  select: {
                    id: true,
                    action: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: id },
      select: { id: true, userRoles: { take: 1 } },
    });

    if (role.userRoles.length) {
      throw new BadRequestException(
        'Failed to delete record, Associated users exist!',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.rolePermissionResourceAction.deleteMany({
        where: {
          rolePermissionResource: {
            role_id: id,
          },
        },
      });

      await tx.rolePermissionResource.deleteMany({
        where: {
          role_id: id,
        },
      });

      return tx.role.delete({ where: { id: id } });
    });
  }
}
