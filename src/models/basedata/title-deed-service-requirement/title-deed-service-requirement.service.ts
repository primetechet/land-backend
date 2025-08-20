import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import {
  CreateTitleDeedServiceRequirementDto,
  UpdateTitleDeedServiceRequirementDto,
  SearchTitleDeedServiceRequirementDto,
} from './dto';
import { paginate } from 'src/common/utils/paginater';

@Injectable()
export class TitleDeedServiceRequirementService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreateTitleDeedServiceRequirementDto) {
    return this.prisma.titleDeedServiceRequirement.create({
      data: {
        description: createDto.description,
        description_json: createDto.description_json,
        title_deed_service_id: createDto.title_deed_service_id,
      },
    });
  }

  async findAll(query: SearchTitleDeedServiceRequirementDto) {
    const { search } = query;
    return this.prisma.titleDeedServiceRequirement.findMany({
      where: search
        ? {
            OR: [{ description: { contains: search, mode: 'insensitive' } }],
          }
        : {},
      include: { titleDeedService: true },
    });
  }

  async findAllPaginated(query: SearchTitleDeedServiceRequirementDto) {
    const { page = 1, limit = 10, search } = query;
    const where = search
      ? {
          OR: [{ description: { contains: search, mode: 'insensitive' } }],
        }
      : {};

    return paginate(
      this.prisma.titleDeedServiceRequirement,
      { where, include: { titleDeedService: true } },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.titleDeedServiceRequirement.findUnique({
      where: { id },
      include: { titleDeedService: true },
    });
    if (!record) throw new NotFoundException('Service requirement not found');
    return record;
  }

  async update(id: string, updateDto: UpdateTitleDeedServiceRequirementDto) {
    await this.findOne(id);
    return this.prisma.titleDeedServiceRequirement.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.titleDeedServiceRequirement.delete({ where: { id } });
  }
}
