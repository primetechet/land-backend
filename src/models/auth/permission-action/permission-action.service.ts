import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreatePermissionActionDto,
  SearchPermissionActionDto,
} from './dto/create-permission-action.dto';
import { UpdatePermissionActionDto } from './dto/update-permission-action.dto';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class PermissionActionService {
  constructor(private readonly prisma: DatabaseService) {}

  async create({ action, description }: CreatePermissionActionDto) {
    const existingAction = await this.prisma.permissionAction.findFirst({
      where: { action },
    });

    if (existingAction) {
      throw new BadRequestException('Permission Action already exists');
    }

    return this.prisma.permissionAction.create({
      data: { action, description },
    });
  }

  async findAllPaginated(options: SearchPermissionActionDto) {
    const { search } = options;
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return await paginate(
      this.prisma.permissionAction,
      {
        where,
      },
      { page: +options.page, perPage: +options.limit },
    );
  }

  findAll() {
    return this.prisma.permissionAction.findMany();
  }

  findOne(id: string) {
    return this.prisma.permissionAction.findUnique({ where: { id: id } });
  }

  update(id: string, updatePermissionActionDto: UpdatePermissionActionDto) {
    return this.prisma.permissionAction.update({
      where: {
        id: id,
      },
      data: {
        action: updatePermissionActionDto.action,
        description: updatePermissionActionDto.description,
      },
    });
  }

  remove(id: string) {
    return this.prisma.permissionAction.delete({ where: { id: id } });
  }
}
