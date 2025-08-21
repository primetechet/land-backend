import { Injectable } from '@nestjs/common';
import {
  CreateTitleDeedApplicationDto,
  SearchTitleDeedApplicationDto,
  UpdateTitleDeedApplicationDto,
} from './dto';
import { TitleDeedApplication } from '@prisma/client';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@Injectable()
export class TitleDeedApplicationService {
  constructor(private readonly prisma: DatabaseService) {}
  async create(
    data: CreateTitleDeedApplicationDto,
    request: EmployeeTokenClaim,
  ): Promise<TitleDeedApplication> {
    return this.prisma.titleDeedApplication.create({
      data: {
        is_organization: data.is_organization,
        title_deed_number: data.title_deed_number || null,
        kebele: data.kebele,
        house_number: data.house_number,
        remark: data.remark,
        titleDeedService: {
          connect: {
            id: data.title_deed_service_id,
          },
        },
        organizationType: data.organization_type_id
          ? {
              connect: {
                id: data.organization_type_id,
              },
            }
          : undefined,
        woreda: {
          connect: {
            id: data.woreda_id,
          },
        },
        branch: {
          connect: {
            id: data.branch_id,
          },
        },
        user: {
          connect: {
            id: request.user.sub,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: UpdateTitleDeedApplicationDto,
  ): Promise<TitleDeedApplication> {
    return this.prisma.titleDeedApplication.update({ where: { id }, data });
  }

  async submit(id: string, request: EmployeeTokenClaim) {
    return await this.prisma.titleDeedApplication.update({
      where: { id, user_id: request.user.sub },
      data: {
        submitted: true,
        submitted_at: new Date(),
      },
      select: {
        id: true,
        submitted: true,
      },
    });
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
