import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import { CreateBranchDto, UpdateBranchDto, SearchBranchDto } from './dto';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreateBranchDto) {
    return this.prisma.branch.create({ data: createDto });
  }

  async findAll(query: SearchBranchDto) {
    const { search } = query;
    return this.prisma.branch.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
    });
  }

  async findAllPaginated(query: SearchBranchDto) {
    const { page = 1, limit = 10, search } = query;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return paginate(
      this.prisma.branch,
      { where },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        woreda: {
          select: {
            district: {
              select: {
                id: true,
                name: true,
                region: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
    if (!record) throw new NotFoundException('Branch not found');
    return record;
  }

  async update(id: string, updateDto: UpdateBranchDto) {
    await this.findOne(id);
    return this.prisma.branch.update({ where: { id }, data: updateDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.branch.delete({ where: { id } });
  }
}
