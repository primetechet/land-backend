import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { paginate } from 'src/common/utils/paginater';
import { I18nTranslations } from 'src/generated/i18n.generated';
import {
  CreatePermissionResourceDto,
  SearchPermissionResourceDto,
} from './dto/create-permission-resource.dto';
import { UpdatePermissionResourceDto } from './dto/update-permission-resource.dto';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class PermissionResourceService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(createPermissionResourceDto: CreatePermissionResourceDto) {
    const existingPermissionResource =
      await this.prisma.permissionResource.findUnique({
        where: { name: createPermissionResourceDto.name },
      });

    if (existingPermissionResource) {
      throw new BadRequestException(
        this.i18n.t('error-messages.already-exists', {
          args: {
            Resource: 'resource',
          },
        }),
      );
    }

    return await this.prisma.permissionResource.create({
      data: {
        name: createPermissionResourceDto.name,
        description: createPermissionResourceDto.description,
      },
    });
  }

  async findAll(options: SearchPermissionResourceDto) {
    return this.prisma.permissionResource.findMany();
  }

  async findAllPaginated(options: SearchPermissionResourceDto) {
    const { search } = options;
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return await paginate(
      this.prisma.permissionResource,
      {
        where,
      },
      { page: +options.page, perPage: +options.limit },
    );
  }

  findOne(id: string) {
    return this.prisma.permissionResource.findUnique({ where: { id: id } });
  }

  update(id: string, updatePermissionResourceDto: UpdatePermissionResourceDto) {
    return this.prisma.permissionResource.update({
      where: {
        id: id,
      },
      data: {
        name: updatePermissionResourceDto.name,
        description: updatePermissionResourceDto.description,
      },
    });
  }

  remove(id: string) {
    return this.prisma.permissionResource.delete({ where: { id: id } });
  }
}
