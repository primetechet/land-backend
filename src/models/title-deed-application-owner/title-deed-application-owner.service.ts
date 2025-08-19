import { Injectable } from '@nestjs/common';
import {
  CreateTitleDeedApplicationOwnerDto,
  UpdateTitleDeedApplicationOwnerDto,
  SearchTitleDeedApplicationOwnerDto,
} from './dto';
import { TitleDeedApplicationOwner } from '@prisma/client';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class TitleDeedApplicationOwnerService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(
    data: CreateTitleDeedApplicationOwnerDto,
  ): Promise<TitleDeedApplicationOwner> {
    return this.prisma.titleDeedApplicationOwner.create({ data });
  }

  async update(
    id: string,
    data: UpdateTitleDeedApplicationOwnerDto,
  ): Promise<TitleDeedApplicationOwner> {
    return this.prisma.titleDeedApplicationOwner.update({
      where: { id },
      data,
    });
  }

  findAll(options: SearchTitleDeedApplicationOwnerDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { father_name: { contains: search, mode: 'insensitive' } },
        { grand_father_name: { contains: search, mode: 'insensitive' } },
        { id_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.titleDeedApplicationOwner.findMany({
      where,
      select: {
        id: true,
        is_organization: true,
        id_type: true,
        id_number: true,
        is_applicant: true,
        first_name: true,
        father_name: true,
        grand_father_name: true,
        gender: true,
        kebele: true,
        house_number: true,
        title_deed_application_id: true,
        disability_status_id: true,
        nationality_id: true,
        residency_country_id: true,
        woreda_id: true,
        remark: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findAllPaginated(options: SearchTitleDeedApplicationOwnerDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { father_name: { contains: search, mode: 'insensitive' } },
        { grand_father_name: { contains: search, mode: 'insensitive' } },
        { id_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    return paginate(
      this.prisma.titleDeedApplicationOwner,
      { where },
      { page: +options.page, perPage: +options.limit },
    );
  }

  findOne(id: string) {
    return this.prisma.titleDeedApplicationOwner.findUnique({
      where: { id },
      select: {
        id: true,
        is_organization: true,
        id_type: true,
        id_number: true,
        is_applicant: true,
        first_name: true,
        father_name: true,
        grand_father_name: true,
        gender: true,
        kebele: true,
        house_number: true,
        remark: true,
        titleDeedApplication: { select: { id: true, title_deed_number: true } },
        disabilityStatus: { select: { id: true, name: true } },
        nationality: { select: { id: true, name: true } },
        residencyCountry: { select: { id: true, name: true } },
        woreda: { select: { id: true, name: true } },
        created_at: true,
        updated_at: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.titleDeedApplicationOwner.delete({ where: { id } });
  }
}
