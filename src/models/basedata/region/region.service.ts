import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { CreateRegionDto, UpdateRegionDto, SearchRegionDto } from './dto';
import { paginate } from 'src/common/utils/paginater';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createRegionDto: CreateRegionDto) {
    const ethCountry = await this.prisma.country.findFirst({
      where: {
        country_code: {
          equals: 'ETH',
          mode: 'insensitive',
        },
      },
    });

    if (!ethCountry) {
      throw new HttpException('Country Ethiopia Not Found', 421);
    }

    return this.prisma.region.create({
      data: { ...createRegionDto, country_id: ethCountry.id },
    });
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

  async findAllPaginated(options: SearchRegionDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return paginate(
      this.prisma.region,
      { where, orderBy: { created_at: 'desc' } },
      { page: +options.page, perPage: +options.limit },
    );
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
