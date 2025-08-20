import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { CreateRegionDto, UpdateRegionDto, SearchRegionDto } from './dto';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createRegionDto: CreateRegionDto) {
    return this.prisma.region.create({ data: createRegionDto });
  }

  async findAll(query?: SearchRegionDto) {
    const where: any = {};
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { zip_code: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.region.findMany({ where });
  }

  async findAllPaginated(query: SearchRegionDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { zip_code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.region.findMany({ where, skip, take: limit }),
      this.prisma.region.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const region = await this.prisma.region.findUnique({ where: { id } });
    if (!region) throw new NotFoundException(`Region with ID ${id} not found`);
    return region;
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    return this.prisma.region.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.region.delete({ where: { id } });
  }
}
