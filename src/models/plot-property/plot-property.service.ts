import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import {
  CreatePlotPropertyDto,
  UpdatePlotPropertyDto,
  SearchPlotPropertyDto,
  ApprovePlotPropertyDto,
} from './dto';
import { paginate } from 'src/common/utils/paginater';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@Injectable()
export class PlotPropertyService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(dto: CreatePlotPropertyDto, request: EmployeeTokenClaim) {
    return this.prisma.plotProperty.create({
      data: {
        property_id: 'TAKE_FROM_TRIGGER',
        basement_floor_number: dto.basement_floor_number,
        upper_floor_number: dto.upper_floor_number,
        building_number: dto.building_number,
        house_number: dto.house_number,
        floor_number: dto.floor_number,
        estimated_price: dto.estimated_price,
        area_meter_square: dto.area_meter_square,
        parking_area_meter_square: dto.parking_area_meter_square,
        building_size_meter_square: dto.building_size_meter_square,
        number_of_lift: dto.number_of_lift,
        remark: dto.remark ?? null,
        plot: {
          connect: {
            id: dto.plot_id,
          },
        },
        propertyUse: {
          connect: {
            id: dto.property_use_id,
          },
        },
        propertyType: {
          connect: {
            id: dto.property_type_id,
          },
        },
        plotRegisteredBy: {
          connect: {
            id: request.user.sub,
          },
        },
      },
    });
  }

  async findAll(query: SearchPlotPropertyDto) {
    const { search, plot_id, property_use_id, property_type_id } = query;

    return this.prisma.plotProperty.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { property_id: { contains: search, mode: 'insensitive' } },
                  {
                    building_number: { contains: search, mode: 'insensitive' },
                  },
                  { house_number: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          plot_id ? { plot_id } : {},
          property_use_id ? { property_use_id } : {},
          property_type_id ? { property_type_id } : {},
        ],
      },
      include: {
        propertyUse: true,
        propertyType: true,
        plot: true,
        rejectionReason: true,
      },
    });
  }

  async findAllPaginated(query: SearchPlotPropertyDto) {
    const { page = 1, limit = 10, ...filters } = query;

    const where = {
      AND: [
        filters.search
          ? {
              OR: [
                {
                  property_id: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  building_number: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  house_number: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {},
        filters.plot_id ? { plot_id: filters.plot_id } : {},
        filters.property_use_id
          ? { property_use_id: filters.property_use_id }
          : {},
        filters.property_type_id
          ? { property_type_id: filters.property_type_id }
          : {},
      ],
    };

    return paginate(
      this.prisma.plotProperty,
      { where },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.plotProperty.findUnique({
      where: { id },
      include: {
        propertyUse: true,
        propertyType: true,
        plot: true,
        rejectionReason: true,
      },
    });
    if (!record) throw new NotFoundException('Plot property not found');
    return record;
  }

  async update(id: string, dto: UpdatePlotPropertyDto) {
    await this.findOne(id);
    return this.prisma.plotProperty.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.plotProperty.delete({ where: { id } });
  }

  async approve(id: string, dto: ApprovePlotPropertyDto) {
    await this.findOne(id);

    return this.prisma.plotProperty.update({
      where: { id },
      data: {
        base_map_approved: dto.approved,
        base_map_approved_at: new Date(),
        base_map_approver_note: dto.note,
        base_map_approved_by_id: dto.updated_by_id,
      },
    });
  }
}
