import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import {
  CreatePlotDto,
  UpdatePlotDto,
  SearchPlotDto,
  ClientRejectPlotDto,
  ClientConfirmationPlotDto,
} from './dto';
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

    const { attributes: arcGisPlot, geometry } = this.getPlotFromArchGis(
      createDto.plot_id,
    );
    console.log(arcGisPlot);
    const landUse = await this.prisma.landUse.findUnique({
      where: { name: arcGisPlot.Land_Use },
    });
    const landGrade = await this.prisma.landGrade.findUnique({
      where: { name: arcGisPlot.Land_Grade },
    });
    const tenureType = await this.prisma.tenureType.findUnique({
      where: { name: arcGisPlot.Tenure_Type },
    });
    const holdingType = await this.prisma.holdingType.findUnique({
      where: { name: arcGisPlot.Holding_Type },
    });

    return await this.prisma.plot.create({
      data: {
        plot_id: arcGisPlot.UniqueID,
        geo: geometry,
        block_number: arcGisPlot.Block_Number,
        area_meter_square: arcGisPlot.Built_up_Area || 10,
        global_id: arcGisPlot.GlobalID,
        titleDeedApplication: {
          connect: {
            id: titleDeedApplication.id,
          },
        },
        landUse: {
          connect: {
            id: landUse.id,
          },
        },
        landGrade: {
          connect: {
            id: landGrade.id,
          },
        },
        tenureType: {
          connect: {
            id: tenureType.id,
          },
        },
        holdingType: {
          connect: {
            id: holdingType.id,
          },
        },
        woreda: {
          connect: {
            id: titleDeedApplication.woreda_id,
          },
        },
        branch: {
          connect: {
            id: titleDeedApplication.branch_id,
          },
        },
        plotRegisteredBy: {
          connect: {
            id: request.user.sub,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  getPlotFromArchGis(plot_id: string): any {
    return {
      attributes: {
        OBJECTID: 80903,
        UniqueID: 'LTP-AD01000002',
        BasemapID: null,
        Landholder_Full_Name: 'test',
        Subcity: 'Addis Ketema',
        New_Wereda: '01',
        Block_Number: null,
        Parcel_Number: null,
        Certificate_Number: null,
        Holding_Type: 'Farmer',
        Land_Use: 'Farming',
        Land_Function: 'Farmer_Residence',
        Land_Grade: 'Grade 1-1',
        Tenure_Type: 'old_possesion',
        Built_up_Area: null,
        Proportional_Area: null,
        Floor_Number: null,
        GlobalID: '{43B62F84-BCBD-42CE-B933-09FC16B4CD19}',
        created_user: 'GIS_ADMIN_HQ',
        created_date: 1756462875000,
        last_edited_user: 'GIS_ADMIN_HQ',
        last_edited_date: 1756462885000,
        CustomID: '000002',
        'SHAPE.STArea()': 1071159.719329834,
        'SHAPE.STLength()': 4832.3826762518092,
      },
      geometry: {
        rings: [
          [
            [474056.14609999955, 1030648.0333999991],
            [475607.62939999998, 1030492.8850999996],
            [474211.29440000001, 1029251.6984000001],
            [474056.14609999955, 1030648.0333999991],
          ],
        ],
      },
    };
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
        holdingType: { select: { id: true, name: true } },
        tenureType: { select: { id: true, name: true } },
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

  async clientConfirmed(id: string, data: ClientConfirmationPlotDto) {
    // const user = await this.prisma.titleDeedApplicationOwner.findFirst({
    //   where: { id_number: request.user.username },
    // });

    // if (!user) {
    //   throw new HttpException('Not your application', 422);
    // }

    const plot = await this.prisma.plot.update({
      where: {
        id: id,
      },
      data: {
        client_confirmed: true,
        client_confirmation_note: data.client_confirmation_note,
        client_confirmed_at: new Date(),
      },
    });

    return {
      data: plot,
      message: 'Plot accepted',
    };
  }

  async clientReject(id: string, data: ClientRejectPlotDto) {
    // const user = await this.prisma.titleDeedApplicationOwner.findFirst({
    //   where: { id_number: request.user.username },
    // });

    // if (!user) {
    //   throw new HttpException('Not your application', 422);
    // }

    const plot = await this.prisma.plot.update({
      where: {
        id: id,
      },
      data: {
        client_rejected: true,
        client_rejection_note: data.client_rejection_note,
        client_rejected_at: new Date(),
      },
    });

    return {
      data: plot,
      message: 'Plot accepted',
    };
  }
}
