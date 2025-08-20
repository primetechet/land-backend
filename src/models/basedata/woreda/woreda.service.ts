import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { CreateWoredaDto, UpdateWoredaDto } from './dto';

@Injectable()
export class WoredaService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createWoredaDto: CreateWoredaDto) {
    return this.prisma.woreda.create({ data: createWoredaDto });
  }

  async findAll(query: any) {
    return this.prisma.woreda.findMany({
      where: query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { district: true },
    });
  }

  async findAllPaginated(query: any) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.woreda.findMany({
        skip,
        take: limit,
        where: query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                {
                  description: { contains: query.search, mode: 'insensitive' },
                },
              ],
            }
          : undefined,
        include: { district: true },
      }),
      this.prisma.woreda.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.prisma.woreda.findUnique({
      where: { id },
      include: { district: true },
    });
  }

  async update(id: string, updateWoredaDto: UpdateWoredaDto) {
    return this.prisma.woreda.update({
      where: { id },
      data: updateWoredaDto,
    });
  }

  async remove(id: string) {
    return this.prisma.woreda.delete({ where: { id } });
  }
}
