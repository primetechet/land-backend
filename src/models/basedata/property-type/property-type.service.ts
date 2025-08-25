import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import {
  CreatePropertyTypeDto,
  UpdatePropertyTypeDto,
  SearchPropertyTypeDto,
} from './dto';

@Injectable()
export class PropertyTypeService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreatePropertyTypeDto) {
    return this.prisma.propertyType.create({ data: createDto });
  }

  async findAll(query: SearchPropertyTypeDto) {
    const { search } = query;
    return this.prisma.propertyType.findMany({
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

  async findAllPaginated(query: SearchPropertyTypeDto) {
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
      this.prisma.propertyType,
      { where },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.propertyType.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Property type not found');
    return record;
  }

  async update(id: string, updateDto: UpdatePropertyTypeDto) {
    await this.findOne(id);
    return this.prisma.propertyType.update({ where: { id }, data: updateDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.propertyType.delete({ where: { id } });
  }
}
