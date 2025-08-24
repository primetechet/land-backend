import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import { CreateLandUseDto, UpdateLandUseDto, SearchLandUseDto } from './dto';

@Injectable()
export class LandUseService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreateLandUseDto) {
    return this.prisma.landUse.create({ data: createDto });
  }

  async findAll(query: SearchLandUseDto) {
    const { search } = query;
    return this.prisma.landUse.findMany({
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

  async findAllPaginated(query: SearchLandUseDto) {
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
      this.prisma.landUse,
      { where },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.landUse.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Land use not found');
    return record;
  }

  async update(id: string, updateDto: UpdateLandUseDto) {
    await this.findOne(id);
    return this.prisma.landUse.update({ where: { id }, data: updateDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.landUse.delete({ where: { id } });
  }
}
