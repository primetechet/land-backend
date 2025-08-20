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
    const { search } = query;
    return this.prisma.titleDeedServiceBranch.findMany({
      where: search
        ? { description: { contains: search, mode: 'insensitive' } }
        : {},
      include: { branch: true, titleDeedService: true },
    });
  }

  async findAllPaginated(query: SearchTitleDeedServiceBranchDto) {
    const { page = 1, limit = 10, search } = query;
    const where = search
      ? { description: { contains: search, mode: 'insensitive' } }
      : {};

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
