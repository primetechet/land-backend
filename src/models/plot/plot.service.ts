import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import { CreatePlotDto, UpdatePlotDto, SearchPlotDto } from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { PaginationDto } from 'src/common/dtos/global.dto';

@Injectable()
export class PlotService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreatePlotDto, request: EmployeeTokenClaim) {
    const titleDeedApplication =
      await this.prisma.titleDeedApplication.findUnique({
        where: { id: createDto.title_deed_application_id },
      });

    return await this.prisma.plot.create({
      data: {
        plot_id: 'TAKE_FROM_TRIGGER',
        block_number: createDto.block_number,
        house_number: createDto.house_number,
        area_meter_square: createDto.area_meter_square,
        remark: createDto.remark,
        title_deed_application_id: titleDeedApplication.id,
        land_use_id: createDto.land_use_id,
        land_grade_id: createDto.land_grade_id,
        woreda_id: titleDeedApplication.woreda_id,
        branch_id: titleDeedApplication.branch_id,
        plot_registered_by_id: request.user.sub,
      },
      select: {
        id: true,
      },
    });
  }

  async findAll(query: SearchPlotDto) {
    const { search, branch_id, woreda_id, land_use_id, land_grade_id } = query;

    return this.prisma.plot.findMany({
      where: {
        AND: [
          branch_id ? { branch_id } : {},
          woreda_id ? { woreda_id } : {},
          land_use_id ? { land_use_id } : {},
          land_grade_id ? { land_grade_id } : {},
          search
            ? {
                OR: [
                  { plot_id: { contains: search, mode: 'insensitive' } },
                  { block_number: { contains: search, mode: 'insensitive' } },
                  { house_number: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      include: {
        landUse: true,
        landGrade: true,
        woreda: true,
        branch: true,
      },
    });
  }

  async findAllPaginated(query: SearchPlotDto) {
    const { page = 1, limit = 10, ...filters } = query;

    const where = {
      AND: [
        filters.branch_id ? { branch_id: filters.branch_id } : {},
        filters.woreda_id ? { woreda_id: filters.woreda_id } : {},
        filters.land_use_id ? { land_use_id: filters.land_use_id } : {},
        filters.land_grade_id ? { land_grade_id: filters.land_grade_id } : {},
        filters.search
          ? {
              OR: [
                { plot_id: { contains: filters.search, mode: 'insensitive' } },
                {
                  block_number: {
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
      ],
    };

    return paginate(
      this.prisma.plot,
      {
        where,
        include: { landUse: true, landGrade: true, woreda: true, branch: true },
      },
      { page: +page, perPage: +limit },
    );
  }

  async plotProperty(id: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;

    return paginate(
      this.prisma.plotProperty,
      {
        where: { plot_id: id },
        include: {
          propertyType: { select: { id: true, name: true } },
          propertyUse: { select: { id: true, name: true } },
          rejectionReason: { select: { id: true, name: true } },
        },
      },
      { page: +page, perPage: +limit },
    );
  }

  async plotCertificate(id: string) {
    const record = await this.prisma.plot.findUnique({
      where: { id },
      include: {
        landUse: { select: { id: true, name: true } },
        landGrade: { select: { id: true, name: true } },
        woreda: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true } },
        titleDeedApplication: {
          include: {
            titleDeedService: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!record) throw new NotFoundException('Plot not found');
    return record;
  }

  async findOne(id: string) {
    const record = await this.prisma.plot.findUnique({
      where: { id },
      include: {
        landUse: { select: { id: true, name: true } },
        landGrade: { select: { id: true, name: true } },
        woreda: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true } },
        rejectionReason: { select: { id: true, name: true } },
      },
    });
    if (!record) throw new NotFoundException('Plot not found');
    return record;
  }

  async update(id: string, updateDto: UpdatePlotDto) {
    await this.findOne(id);
    return this.prisma.plot.update({ where: { id }, data: updateDto });
  }

  async submit(id: string, request: EmployeeTokenClaim) {
    const plot = await this.prisma.plot.update({
      where: { id },
      data: {
        submitted: true,
        submitted_at: new Date(),
      },
      select: {
        id: true,
        submitted: true,
        title_deed_application_id: true,
      },
    });

    await this.prisma.titleDeedApplication.update({
      where: { id: plot.title_deed_application_id },
      data: {
        plot_registered: true,
        plot_registered_at: new Date(),
        plot_registered_by_id: request.user.sub,
      },
      select: {
        id: true,
      },
    });

    await this.prisma.titleDeedApplicationReview.updateMany({
      where: {
        title_deed_application_id: plot.title_deed_application_id,
        role: 'PLOT_REGISTRATION',
      },
      data: {
        completed: true,
        completed_at: new Date(),
      },
    });

    return plot;
  }
}
