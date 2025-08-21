import { Injectable } from '@nestjs/common';
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
    request: EmployeeTokenClaim,
  ): Promise<TitleDeedApplication> {
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

  async submit(id: string, request: EmployeeTokenClaim) {
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

    return paginate(
      this.prisma.titleDeedApplication,
      { where },
      { page: +options.page, perPage: +options.limit },
    );
  }

  findOne(id: string) {
    return this.prisma.titleDeedApplication.findUnique({
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
}
