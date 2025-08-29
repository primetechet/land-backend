import { Injectable, HttpException } from '@nestjs/common';
import {
  CreateTitleDeedApplicationDto,
  SearchTitleDeedApplicationDto,
  UpdateTitleDeedApplicationDto,
} from './dto';
import { TitleDeedApplication } from '@prisma/client';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@Injectable()
export class TitleDeedApplicationService {
  constructor(private readonly prisma: DatabaseService) {}
  async create(
    data: CreateTitleDeedApplicationDto,
    request: any,
  ): Promise<TitleDeedApplication> {
    // Check if the user exists (either as User or Employee)
    const user = await this.prisma.user.findUnique({
      where: { id: request.user.sub },
    });

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!user && !employee) {
      throw new HttpException('User not found', 404);
    }

    // If it's an employee, we need to handle this differently
    // For now, let's assume employees can create applications on behalf of users
    // You might want to add a user_id field to the DTO to specify which user the application belongs to
    if (employee && !user) {
      throw new HttpException(
        'Employees cannot create applications directly. Please specify a user ID.',
        422,
      );
    }

    return this.prisma.titleDeedApplication.create({
      data: {
        application_no: 'TAKE_FROM_TRIGGER',
        is_organization: data.is_organization,
        title_deed_number: data.title_deed_number || null,
        kebele: data.kebele,
        house_number: data.house_number,
        remark: data.remark,
        titleDeedService: {
          connect: {
            id: data.title_deed_service_id,
          },
        },
        organizationType: data.organization_type_id
          ? {
              connect: {
                id: data.organization_type_id,
              },
            }
          : undefined,
        woreda: {
          connect: {
            id: data.woreda_id,
          },
        },
        branch: {
          connect: {
            id: data.branch_id,
          },
        },
        user: {
          connect: {
            id: request.user.sub,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: UpdateTitleDeedApplicationDto,
  ): Promise<TitleDeedApplication> {
    return this.prisma.titleDeedApplication.update({ where: { id }, data });
  }

  async submit(id: string, request: any) {
    return await this.prisma.titleDeedApplication.update({
      where: { id, user_id: request.user.sub },
      data: {
        submitted: true,
        submitted_at: new Date(),
      },
      select: {
        id: true,
        submitted: true,
      },
    });
  }

  findAll(options: SearchTitleDeedApplicationDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.OR = [
        { title_deed_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.titleDeedApplication.findMany({
      where,
      select: {
        id: true,
        is_organization: true,
        title_deed_number: true,
        kebele: true,
        house_number: true,
        remark: true,
        title_deed_service_id: true,
        organization_type_id: true,
        woreda_id: true,
        branch_id: true,
        user_id: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findAllPaginated(options: SearchTitleDeedApplicationDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.OR = [
        { title_deed_number: { contains: search, mode: 'insensitive' } },
        { kebele: { contains: search, mode: 'insensitive' } },
        { house_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    this.prisma.titleDeedApplication.findMany({
      where: {
        titleDeedApplicationOwners: {
          some: {
            first_name_am: 'ብስራት',
          },
        },
      },
    });

    return paginate(
      this.prisma.titleDeedApplication,
      {
        where: {
          titleDeedApplicationOwners: {
            some: {
              first_name_am: 'ብስራት',
            },
          },
        },
        orderBy: { created_at: 'desc' },
        include: {
          titleDeedService: { select: { id: true, name: true } },
          organizationType: { select: { id: true, name: true } },
          _count: {
            select: {
              titleDeedApplicationOwners: true,
            },
          },
          woreda: {
            select: {
              id: true,
              name: true,
              district: { select: { id: true, name: true } },
            },
          },

          titleDeedApplicationOwners: {
            where: { is_applicant: true },
            take: 1,
          },
          branch: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
        },
      },
      { page: +options.page, perPage: +options.limit },
    );
  }

  async titleDeedPlot(id: string, options: SearchTitleDeedApplicationDto) {
    const { search } = { ...options };
    const where: any = {};

    return paginate(
      this.prisma.plot,
      {
        where: { title_deed_application_id: id },
        include: {
          landUse: { select: { id: true, name: true } },
          landGrade: { select: { id: true, name: true } },
          plotProperties: true,
        },
      },
      { page: +options.page, perPage: +options.limit },
    );
  }

  async titleDeedOwner(id: string, options: SearchTitleDeedApplicationDto) {
    const { search } = { ...options };
    const where: any = {};

    return await this.prisma.titleDeedApplicationOwner.findMany({
      where: { title_deed_application_id: id },
      include: {
        disabilityStatus: {
          select: { id: true, name: true },
        },
        nationality: {
          select: { id: true, name: true, nationality: true },
        },
        residencyCountry: {
          select: { id: true, name: true },
        },
        woreda: {
          select: { id: true, name: true },
        },
      },
    });
  }

  findOne(id: string) {
    const titleDeedApplication = this.prisma.titleDeedApplication.findUnique({
      where: { id },
      include: {
        titleDeedService: { select: { id: true, name: true } },
        organizationType: { select: { id: true, name: true } },
        titleDeedApplicationOwners: {
          where: { is_applicant: true },
        },
        woreda: {
          select: {
            id: true,
            name: true,
            district: { select: { id: true, name: true } },
          },
        },
        branch: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });

    return titleDeedApplication;
  }

  async archiveDocuments(id: string) {
    return await this.prisma.titleDeedApplicationDocument.findMany({
      where: {
        title_deed_application_id: id,
      },
    });
  }

  async clientDocuments(id: string) {
    const titleDeedApplication =
      await this.prisma.titleDeedApplication.findUnique({
        where: { id: id },
        select: { id: true, title_deed_service_id: true },
      });

    return await this.prisma.titleDeedServiceDocumentType
      .findMany({
        where: {
          title_deed_service_id: titleDeedApplication.title_deed_service_id,
        },
        include: {
          documentType: {
            select: {
              id: true,
              name: true,
            },
          },
          titleDeedApplicationClientDocuments: {
            orderBy: { created_at: 'desc' },
            where: { title_deed_application_id: id },
            include: {
              verifiedBy: {
                select: {
                  name: true,
                },
              },
              createdBy: {
                select: {
                  name: true,
                },
              },
              rejectedBy: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })
      .then((types) => {
        return types.map((type: any) => {
          const hasRejected = type.titleDeedApplicationClientDocuments.some(
            (doc) => doc.rejected,
          );
          const hasPending = type.titleDeedApplicationClientDocuments.some(
            (doc) => !doc.rejected && !doc.verified,
          );
          const hasVerified = type.titleDeedApplicationClientDocuments.some(
            (doc) => doc.verified,
          );

          return {
            ...type,
            has_rejected: hasRejected,
            has_pending: hasPending,
            has_verified: hasVerified,
          };
        });
      });
  }

  async findMyApplications(
    request: any,
    options: SearchTitleDeedApplicationDto,
  ) {
    const { search } = { ...options };

    // Get user's information
    const user = await this.prisma.user.findUnique({
      where: { id: request.user.sub },
      select: {
        id_type: true,
        secondary_id_type: true,
        secondary_id: true,
        username: true,
        phone_number: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const where: any = {
      titleDeedApplicationOwners: {
        some: {
          OR: [
            // Match by secondary ID if available
            ...(user.secondary_id_type && user.secondary_id
              ? [
                  {
                    id_type: user.secondary_id_type,
                    id_number: user.secondary_id,
                  },
                  {
                    id_type: user.id_type,
                    id_number: user.username,
                  },
                ]
              : [
                  {
                    id_type: user.id_type,
                    id_number: user.username,
                  },
                ]),
          ],
        },
      },
    };

    if (search) {
      where.OR = [
        { title_deed_number: { contains: search, mode: 'insensitive' } },
        { kebele: { contains: search, mode: 'insensitive' } },
        { house_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    return paginate(
      this.prisma.titleDeedApplication,
      {
        where,
        orderBy: { created_at: 'desc' },
        include: {
          titleDeedService: { select: { id: true, name: true } },
          organizationType: { select: { id: true, name: true } },
          _count: {
            select: {
              titleDeedApplicationOwners: true,
            },
          },
          woreda: {
            select: {
              id: true,
              name: true,
              district: { select: { id: true, name: true } },
            },
          },
          branch: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          titleDeedApplicationOwners: {
            where: {
              verified: true,
              rejected: false,
              OR: [
                ...(user.secondary_id_type && user.secondary_id
                  ? [
                      {
                        id_type: user.secondary_id_type,
                        id_number: user.secondary_id,
                      },
                    ]
                  : []),
              ],
            },
            select: {
              id: true,
              first_name: true,
              father_name: true,
              grand_father_name: true,
              id_type: true,
              id_number: true,
              verified: true,
              verified_at: true,
            },
          },
        },
      },
      { page: +options.page, perPage: +options.limit },
    );
  }

  async findApplicationsByOwnerId(
    idType: string,
    idNumber: string,
    options: SearchTitleDeedApplicationDto,
  ) {
    const { search } = { ...options };

    const where: any = {
      titleDeedApplicationOwners: {
        some: {
          id_type: idType,
          id_number: idNumber,
        },
      },
    };

    if (search) {
      where.OR = [
        { title_deed_number: { contains: search, mode: 'insensitive' } },
        { kebele: { contains: search, mode: 'insensitive' } },
        { house_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    return paginate(
      this.prisma.titleDeedApplication,
      {
        where,
        orderBy: { created_at: 'desc' },
        include: {
          titleDeedService: { select: { id: true, name: true } },
          organizationType: { select: { id: true, name: true } },
          _count: {
            select: {
              titleDeedApplicationOwners: true,
            },
          },
          woreda: {
            select: {
              id: true,
              name: true,
              district: { select: { id: true, name: true } },
            },
          },
          branch: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          titleDeedApplicationOwners: {
            where: {
              verified: true,
              rejected: false,
              id_type: idType,
              id_number: idNumber,
            },
            select: {
              id: true,
              first_name: true,
              father_name: true,
              grand_father_name: true,
              id_type: true,
              id_number: true,
              verified: true,
              verified_at: true,
            },
          },
        },
      },
      { page: +options.page, perPage: +options.limit },
    );
  }
}
