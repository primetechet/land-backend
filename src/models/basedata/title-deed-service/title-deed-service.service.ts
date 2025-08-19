import { Injectable } from '@nestjs/common';
import {
  CreateTitleDeedServiceDto,
  SearchTitleDeedServiceDto,
  UpdateTitleDeedServiceDto,
} from './dto';
import { TitleDeedService as TitleDeedServiceModel } from '@prisma/client';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class TitleDeedServiceService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(
    data: CreateTitleDeedServiceDto,
  ): Promise<TitleDeedServiceModel> {
    return this.prisma.titleDeedService.create({
      data: {
        name: data.name,
        name_json: data.name_json,
        icon: data.icon,
        description: data.description,
        description_json: data.description_json,
        has_existing_title_deed: data.has_existing_title_deed ?? false,
        parent_title_deed_service_id: data.parent_title_deed_service_id,
        created_by_id: data.created_by_id,
      },
    });
  }

  async update(
    id: string,
    data: UpdateTitleDeedServiceDto,
  ): Promise<TitleDeedServiceModel> {
    return this.prisma.titleDeedService.update({
      where: { id },
      data: {
        name: data.name,
        name_json: data.name_json,
        icon: data.icon,
        description: data.description,
        description_json: data.description_json,
        has_existing_title_deed: data.has_existing_title_deed,
        parent_title_deed_service_id: data.parent_title_deed_service_id,
        updated_by_id: data.updated_by_id,
      },
    });
  }

  findAll(options: SearchTitleDeedServiceDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return this.prisma.titleDeedService.findMany({
      where,
      select: {
        id: true,
        name: true,
        name_json: true,
        icon: true,
        description: true,
        description_json: true,
        has_existing_title_deed: true,
        parent_title_deed_service_id: true,
        draft: true,
        created_at: true,
        updated_at: true,
        created_by_id: true,
        updated_by_id: true,
      },
    });
  }

  async findAllPaginated(options: SearchTitleDeedServiceDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return paginate(
      this.prisma.titleDeedService,
      { where },
      { page: +options.page, perPage: +options.limit },
    );
  }

  findOne(id: string) {
    return this.prisma.titleDeedService.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        name_json: true,
        icon: true,
        description: true,
        description_json: true,
        has_existing_title_deed: true,
        parent_title_deed_service_id: true,
        childrenTitleDeedServices: {
          select: { id: true, name: true, name_json: true },
        },
        draft: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.titleDeedService.delete({ where: { id } });
  }
}
