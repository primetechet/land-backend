import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import {
  CreateOrganizationTypeDto,
  UpdateOrganizationTypeDto,
  SearchOrganizationTypeDto,
} from './dto';
import { paginate } from 'src/common/utils/paginater';

@Injectable()
export class OrganizationTypeService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreateOrganizationTypeDto) {
    return this.prisma.organizationType.create({ data: createDto });
  }

  async findAll(query: SearchOrganizationTypeDto) {
    const { search } = query;
    return this.prisma.organizationType.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
    });
  }

  async findAllPaginated(query: SearchOrganizationTypeDto) {
    const { page = 1, limit = 10, search } = query;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return paginate(
      this.prisma.organizationType,
      { where },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.organizationType.findUnique({
      where: { id },
    });
    if (!record) throw new NotFoundException('OrganizationType not found');
    return record;
  }

  async update(id: string, updateDto: UpdateOrganizationTypeDto) {
    await this.findOne(id);
    return this.prisma.organizationType.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.organizationType.delete({ where: { id } });
  }
}
