import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import {
  CreatePropertyUseDto,
  UpdatePropertyUseDto,
  SearchPropertyUseDto,
} from './dto';

@Injectable()
export class PropertyUseService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreatePropertyUseDto) {
    return this.prisma.propertyUse.create({ data: createDto });
  }

  async findAll(query: SearchPropertyUseDto) {
    const { search } = query;
    return this.prisma.propertyUse.findMany({
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

  async findAllPaginated(query: SearchPropertyUseDto) {
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
      this.prisma.propertyUse,
      { where },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.propertyUse.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Property use not found');
    return record;
  }

  async update(id: string, updateDto: UpdatePropertyUseDto) {
    await this.findOne(id);
    return this.prisma.propertyUse.update({ where: { id }, data: updateDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.propertyUse.delete({ where: { id } });
  }
}
