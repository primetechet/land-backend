import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import {
  CreatePlotDto,
  UpdatePlotDto,
  SearchPlotDto,
  ClientRejectPlotDto,
  ClientConfirmationPlotDto,
  CreateBaseMapDto,
  SpatialQueryDto,
} from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';

@Injectable()
export class PlotService {
  constructor(
    private readonly prisma: DatabaseService,
    private httpService: HttpService,
  ) {}

  async create(createDto: CreatePlotDto, request: EmployeeTokenClaim) {
    const titleDeedApplication =
      await this.prisma.titleDeedApplication.findUnique({
        where: { id: createDto.title_deed_application_id },
      });

    // Fetch only approved owners for this title deed application for auditing
    const owners = await this.prisma.titleDeedApplicationOwner.findMany({
      where: {
        title_deed_application_id: createDto.title_deed_application_id,
        verified: true,
        rejected: false,
      },
      select: {
        id_type: true,
        id_number: true,
        first_name: true,
        father_name: true,
        grand_father_name: true,
        gender: true,
        is_organization: true,
        is_representative: true,
        is_applicant: true,
        verified: true,
        rejected: true,
      },
    });

    const response = await this.getPlotFromArchGis(createDto.plot_id);
    const { attributes: arcGisPlot, geometry } = response.features[0];

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
        plot_id: createDto.plot_id,
        geo: geometry,
        block_number: arcGisPlot.Block_Number,
        area_meter_square: arcGisPlot.Built_up_Area || 10,
        global_id: arcGisPlot.GlobalID,
        title_deed_application_id: titleDeedApplication.id,
        woreda_id: titleDeedApplication.woreda_id,
        branch_id: titleDeedApplication.branch_id,
        plot_registered_by_id: request.user.sub,
        owners_audit: owners,
        land_use_id: '67b88736-7d8a-46d7-b769-eede8faf9b2f',
        land_grade_id: '82a7ef1e-42f7-4b61-89e4-3ffa55a5641a',
        tenure_type_id: '0a1b2c3d-4e5f-4a12-8b9c-a0b1c2d3e4f0',
        holding_type_id: '0a1b2c3d-4e5f-4a12-8b9c-a0b1c2d3e4f0',
      },
      select: {
        id: true,
      },
    });
  }

  async setBaseMapId(
    id: string,
    setBaseMapDto: CreateBaseMapDto,
    request: EmployeeTokenClaim,
  ) {
    const plot = await this.prisma.plot.findUnique({
      where: { id },
      select: { plot_id: true, title_deed_application_id: true },
    });
    if (!plot) throw new NotFoundException('Plot not found');

    const response = await this.getBaseMapFromArchGis(plot.plot_id);
    if (!response.features || response.features.length === 0) {
      throw new NotFoundException('Base map not found in ArcGIS');
    }

    const { attributes: arcGisPlot, geometry } = response.features[0];
    console.log(plot);
    ('d6616675-8541-4471-8118-78b1d2c0ea25');

    await this.prisma.plot.update({
      where: { id },
      data: { base_map_id: setBaseMapDto.base_map_id },
    });

    await this.prisma.titleDeedApplicationReview.updateMany({
      where: {
        title_deed_application_id: plot.title_deed_application_id,
        completed: false,
      },
      data: {
        completed: true,
        completed_at: new Date(),
        note: `Task Completed`,
      },
    });

    await this.prisma.titleDeedApplication.update({
      where: { id: plot.title_deed_application_id },
      data: {
        base_map_approved_by_id: request.user.sub,
        base_map_approved_at: new Date(),
        base_map_approved: true,
      },
    });
    return plot;
  }

  async getBaseMapFromArchGis(plot_id: string) {
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false, // ❌ disables cert validation
      });

      // ${encodeURIComponent(plot_id)}
      const url = `https://10.32.141.81:6443/arcgis/rest/services/AI/LandTenureBasemap/FeatureServer/0/query?where=BasemapID='GU062025000006'&outFields=*&f=pjson`;

      const response = await this.httpService
        .post(url, {}, { httpsAgent: agent })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('FAILED:', error.message);
      return { success: false, message: 'Failed to fetch data' };
    }
  }

  async getPlotFromArchGis(plot_id: string) {
    return {
      features: [
        {
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
            Land_Use: 'Airport',
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
                [474000, 1030700],
                [474800, 1030650],
                [475200, 1030500],
                [475600, 1030300],
                [475400, 1029900],
                [475000, 1029600],
                [474500, 1029400],
                [474100, 1029500],
                [473900, 1029800],
                [473800, 1030200],
                [474000, 1030700],
              ],
            ],
          },
        },
      ],
    };
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false, // ❌ disables cert validation
      });

      const url = `https://10.32.141.81:6443/arcgis/rest/services/AI/LandTenure/FeatureServer/0/query?where=UniqueID='${encodeURIComponent(plot_id)}'&outFields=*&f=pjson&num=1`;

      const response = await this.httpService
        .post(url, {}, { httpsAgent: agent })
        .toPromise();

      console.info('Plot Fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('FAILED:', error.message);
      return { success: false, message: 'Failed to fetch data' };
    }
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
        holdingType: { select: { id: true, name: true } },
        tenureType: { select: { id: true, name: true } },
        rejectionReason: { select: { id: true, name: true } },
        woreda: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true } },
        titleDeedApplication: {
          include: {
            titleDeedService: { select: { id: true, name: true } },
            titleDeedApplicationOwners: true,
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

  async findSpatial(query: SpatialQueryDto) {
    const {
      point,
      bbox,
      buffer_distance,
      center,
      page = 1,
      limit = 10,
    } = query;

    let whereClause = '';
    let params: any[] = [];
    let paramIndex = 1;

    if (point) {
      // Point-in-polygon query
      whereClause = `ST_Contains(geom, ST_GeomFromText($${paramIndex}, 20137))`;
      params.push(`POINT(${point[0]} ${point[1]})`);
      paramIndex++;
    } else if (bbox) {
      // Bounding box query
      whereClause = `ST_Intersects(geom, ST_MakeEnvelope($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, 20137))`;
      params.push(bbox[0], bbox[1], bbox[2], bbox[3]);
      paramIndex += 4;
    } else if (center && buffer_distance) {
      // Buffer query
      whereClause = `ST_DWithin(geom, ST_GeomFromText($${paramIndex}, 20137), $${paramIndex + 1})`;
      params.push(`POINT(${center[0]} ${center[1]})`, buffer_distance);
      paramIndex += 2;
    } else {
      throw new Error(
        'At least one spatial parameter (point, bbox, or center+buffer_distance) is required',
      );
    }

    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM plots 
      WHERE geom IS NOT NULL AND ${whereClause}
    `;

    // Get paginated results
    const dataQuery = `
      SELECT 
        id,
        plot_id,
        block_number,
        house_number,
        area_meter_square,
        ST_AsText(geom) as geom_wkt,
        ST_Area(geom) as calculated_area,
        ST_Perimeter(geom) as calculated_perimeter,
        ST_SRID(geom) as srid,
        geo,
        created_at,
        updated_at
      FROM plots 
      WHERE geom IS NOT NULL AND ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const [countResult, dataResult] = await Promise.all([
      this.prisma.$queryRawUnsafe(countQuery, ...params),
      this.prisma.$queryRawUnsafe(dataQuery, ...params, limit, offset),
    ]);

    const total = parseInt((countResult as any)[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      data: dataResult,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async validateGeometry(geo: any) {
    try {
      // Basic structure validation
      if (!geo || typeof geo !== 'object') {
        return {
          valid: false,
          errors: ['Geometry object is required'],
        };
      }

      if (!geo.geometry || !geo.geometry.rings) {
        return {
          valid: false,
          errors: ['Geometry must have geometry.rings property'],
        };
      }

      const rings = geo.geometry.rings;
      if (!Array.isArray(rings) || rings.length === 0) {
        return {
          valid: false,
          errors: ['Rings must be a non-empty array'],
        };
      }

      const errors: string[] = [];
      const warnings: string[] = [];

      // Validate each ring
      rings.forEach((ring, ringIndex) => {
        if (!Array.isArray(ring) || ring.length < 4) {
          errors.push(
            `Ring ${ringIndex} must have at least 4 coordinate pairs`,
          );
          return;
        }

        // Check if ring is closed
        const firstPoint = ring[0];
        const lastPoint = ring[ring.length - 1];
        if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
          warnings.push(
            `Ring ${ringIndex} is not closed (first and last points differ)`,
          );
        }

        // Validate coordinate pairs
        ring.forEach((coord, coordIndex) => {
          if (!Array.isArray(coord) || coord.length !== 2) {
            errors.push(
              `Ring ${ringIndex}, coordinate ${coordIndex} must be [x, y] array`,
            );
            return;
          }

          const [x, y] = coord;
          if (typeof x !== 'number' || typeof y !== 'number') {
            errors.push(
              `Ring ${ringIndex}, coordinate ${coordIndex} must have numeric values`,
            );
          }

          if (isNaN(x) || isNaN(y)) {
            errors.push(
              `Ring ${ringIndex}, coordinate ${coordIndex} contains NaN values`,
            );
          }
        });
      });

      // Check spatial reference
      if (geo.spatialReference && geo.spatialReference.wkid !== 20137) {
        warnings.push(
          `Expected SRID 20137, found ${geo.spatialReference.wkid}`,
        );
      }

      // Try to create PostGIS geometry for validation
      let postgisValid = false;
      let postgisError = '';
      try {
        const result = await this.prisma.$queryRaw`
          SELECT convert_esri_rings_to_polygon(${JSON.stringify(geo)}::jsonb) as geom
        `;
        const geom = (result as any)[0].geom;
        if (geom) {
          postgisValid = true;
        }
      } catch (error) {
        postgisError = error.message;
      }

      return {
        valid: errors.length === 0 && postgisValid,
        errors: postgisError
          ? [...errors, `PostGIS validation failed: ${postgisError}`]
          : errors,
        warnings,
        postgisValid,
        ringCount: rings.length,
        coordinateCount: rings.reduce((sum, ring) => sum + ring.length, 0),
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Validation failed: ${error.message}`],
      };
    }
  }
}
