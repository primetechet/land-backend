import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import {
  CreateRejectionReasonDto,
  UpdateRejectionReasonDto,
  SearchRejectionReasonDto,
} from './dto';

@Injectable()
export class RejectionReasonService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreateRejectionReasonDto) {
    return this.prisma.rejectionReason.create({ data: createDto });
  }

  async findAll(query: SearchRejectionReasonDto) {
    const { search } = query;
    return this.prisma.rejectionReason.findMany({
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

  async findAllPaginated(query: SearchRejectionReasonDto) {
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
      this.prisma.rejectionReason,
      { where },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.rejectionReason.findUnique({
      where: { id },
    });
    if (!record) throw new NotFoundException('Rejection reason not found');
    return record;
  }

  async update(id: string, updateDto: UpdateRejectionReasonDto) {
    await this.findOne(id);
    return this.prisma.rejectionReason.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.rejectionReason.delete({ where: { id } });
  }
}
