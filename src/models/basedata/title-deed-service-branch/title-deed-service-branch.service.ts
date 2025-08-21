import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import {
  CreateTitleDeedServiceBranchDto,
  UpdateTitleDeedServiceBranchDto,
  SearchTitleDeedServiceBranchDto,
} from './dto';

@Injectable()
export class TitleDeedServiceBranchService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreateTitleDeedServiceBranchDto) {
    return this.prisma.titleDeedServiceBranch.create({ data: createDto });
  }

  async findAll(query: SearchTitleDeedServiceBranchDto) {
    const { title_deed_service_id } = query;
    const where: any = {};

    if (title_deed_service_id)
      where.title_deed_service_id = title_deed_service_id;

    if (title_deed_service_id)
      where.title_deed_service_id = title_deed_service_id;

    return this.prisma.titleDeedServiceBranch.findMany({
      where,
      include: { branch: true, titleDeedService: true },
    });
  }

  async findAllPaginated(query: SearchTitleDeedServiceBranchDto) {
    const { page = 1, limit = 10, title_deed_service_id } = query;
    const where: any = {};

    if (title_deed_service_id)
      where.title_deed_service_id = title_deed_service_id;

    return paginate(
      this.prisma.titleDeedServiceBranch,
      { where, include: { branch: true, titleDeedService: true } },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.titleDeedServiceBranch.findUnique({
      where: { id },
      include: { branch: true, titleDeedService: true },
    });
    if (!record)
      throw new NotFoundException('TitleDeedServiceBranch not found');
    return record;
  }

  async update(id: string, updateDto: UpdateTitleDeedServiceBranchDto) {
    await this.findOne(id);
    return this.prisma.titleDeedServiceBranch.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.titleDeedServiceBranch.delete({ where: { id } });
  }
}
