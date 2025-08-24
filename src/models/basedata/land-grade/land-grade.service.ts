import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import {
  CreateLandGradeDto,
  UpdateLandGradeDto,
  SearchLandGradeDto,
} from './dto';

@Injectable()
export class LandGradeService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreateLandGradeDto) {
    return this.prisma.landGrade.create({ data: createDto });
  }

  async findAll(query: SearchLandGradeDto) {
    const { search } = query;
    return this.prisma.landGrade.findMany({
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

  async findAllPaginated(query: SearchLandGradeDto) {
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
      this.prisma.landGrade,
      { where },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.landGrade.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Land grade not found');
    return record;
  }

  async update(id: string, updateDto: UpdateLandGradeDto) {
    await this.findOne(id);
    return this.prisma.landGrade.update({ where: { id }, data: updateDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.landGrade.delete({ where: { id } });
  }
}
