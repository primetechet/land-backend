import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import {
  CreateDisabilityStatusDto,
  UpdateDisabilityStatusDto,
  SearchDisabilityStatusDto,
} from './dto';

@Injectable()
export class DisabilityStatusService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDisabilityStatusDto: CreateDisabilityStatusDto) {
    return this.prisma.disabilityStatus.create({
      data: createDisabilityStatusDto,
    });
  }

  async findAll(query?: SearchDisabilityStatusDto) {
    const where: any = {};
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.disabilityStatus.findMany({ where });
  }

  async findAllPaginated(query: SearchDisabilityStatusDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.disabilityStatus.findMany({ where, skip, take: limit }),
      this.prisma.disabilityStatus.count({ where }),
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
    const disabilityStatus = await this.prisma.disabilityStatus.findUnique({
      where: { id },
    });
    if (!disabilityStatus) {
      throw new NotFoundException(`DisabilityStatus with ID ${id} not found`);
    }
    return disabilityStatus;
  }

  async update(
    id: string,
    updateDisabilityStatusDto: UpdateDisabilityStatusDto,
  ) {
    return this.prisma.disabilityStatus.update({
      where: { id },
      data: updateDisabilityStatusDto,
    });
  }

  async remove(id: string) {
    return this.prisma.disabilityStatus.delete({ where: { id } });
  }
}
