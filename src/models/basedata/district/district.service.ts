import { Injectable } from '@nestjs/common';
import { CreateDistrictDto, SearchDistrictDto } from './dto';
import { UpdateDistrictDto } from './dto';
import { District } from '@prisma/client';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class DistrictService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(data: CreateDistrictDto): Promise<District> {
    const district = await this.prisma.district.create({
      data: {
        name: data.name,
        name_json: data.name_json,
        description: data.description,
        description_json: data.description_json,
        region_id: data.region_id,
        zip_code: data.zip_code,
        created_by_id: data.created_by_id,
      },
    });

    return district;
  }

  async update(id: string, data: UpdateDistrictDto): Promise<District> {
    const district = await this.prisma.district.update({
      data: {
        name: data.name,
        name_json: data.name_json,
        description: data.description,
        description_json: data.description_json,
        region_id: data.region_id,
        zip_code: data.zip_code,
        updated_by_id: data.updated_by_id,
      },
      where: { id: id },
    });

    return district;
  }

  findAll(options: SearchDistrictDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return this.prisma.district.findMany({
      where,
      select: {
        id: true,
        name: true,
        name_json: true,
        description: true,
        description_json: true,
        region_id: true,
        zip_code: true,
        drafted_at: true,
        drafted_by_id: true,
        created_at: true,
        updated_at: true,
        created_by_id: true,
        updated_by_id: true,
      },
    });
  }

  async findAllPaginated(options: SearchDistrictDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return paginate(
      this.prisma.district,
      { where },
      { page: +options.page, perPage: +options.limit },
    );
  }

  findOne(id: string) {
    return this.prisma.district.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        name_json: true,
        description: true,
        description_json: true,
        draft: true,
        region: {
          select: {
            id: true,
            name: true,
            name_json: true,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.district.delete({ where: { id: id } });
  }
}
