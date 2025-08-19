import { Injectable } from '@nestjs/common';
import {
  CreateTitleDeedApplicationDto,
  SearchTitleDeedApplicationDto,
  UpdateTitleDeedApplicationDto,
} from './dto';
import { TitleDeedApplication } from '@prisma/client';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class TitleDeedApplicationService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(
    data: CreateTitleDeedApplicationDto,
  ): Promise<TitleDeedApplication> {
    return this.prisma.titleDeedApplication.create({ data });
  }

  async update(
    id: string,
    data: UpdateTitleDeedApplicationDto,
  ): Promise<TitleDeedApplication> {
    return this.prisma.titleDeedApplication.update({ where: { id }, data });
  }

  findAll(options: SearchTitleDeedApplicationDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.OR = [
        { title_deed_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.titleDeedApplication.findMany({
      where,
      select: {
        id: true,
        is_organization: true,
        title_deed_number: true,
        kebele: true,
        house_number: true,
        remark: true,
        title_deed_service_id: true,
        organization_type_id: true,
        woreda_id: true,
        branch_id: true,
        user_id: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findAllPaginated(options: SearchTitleDeedApplicationDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.OR = [
        { title_deed_number: { contains: search, mode: 'insensitive' } },
        { kebele: { contains: search, mode: 'insensitive' } },
        { house_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    return paginate(
      this.prisma.titleDeedApplication,
      { where },
      { page: +options.page, perPage: +options.limit },
    );
  }

  findOne(id: string) {
    return this.prisma.titleDeedApplication.findUnique({
      where: { id },
      select: {
        id: true,
        is_organization: true,
        title_deed_number: true,
        kebele: true,
        house_number: true,
        remark: true,
        draft: true,
        titleDeedService: { select: { id: true, name: true } },
        organizationType: { select: { id: true, name: true } },
        woreda: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        created_at: true,
        updated_at: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.titleDeedApplication.delete({ where: { id } });
  }
}
