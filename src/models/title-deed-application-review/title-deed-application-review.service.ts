import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AppointmentTitleDeedApplicationReviewDto,
  ArchiveTitleDeedApplicationReviewDto,
  AuthorizeTitleDeedApplicationReviewDto,
  CreateManualTitleDeedApplicationReviewDto,
  CreateTitleDeedApplicationReviewDto,
  RejectTitleDeedApplicationReviewDto,
  SearchTitleDeedApplicationReviewDto,
  ValidateTitleDeedApplicationReviewDto,
  VerifyTitleDeedApplicationReviewDto,
} from './dto';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@Injectable()
export class TitleDeedApplicationReviewService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    request: EmployeeTokenClaim,
    createTitleDeedApplicationReviewDto: CreateTitleDeedApplicationReviewDto,
  ) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('Invalid Employee', 422);
    }

    let applicationCondition: any = {};

    if (createTitleDeedApplicationReviewDto.action == 'ARCHIVE') {
      applicationCondition = {
        archived: false,
        submitted: true,
      };
    } else if (createTitleDeedApplicationReviewDto.action == 'VERIFICATION') {
      applicationCondition = {
        verified: false,
        submitted: true,
        archived: true,
      };
    } else if (
      createTitleDeedApplicationReviewDto.action == 'PLOT_REGISTRATION'
    ) {
      applicationCondition = {
        submitted: true,
        verified: true,
        plot_registered: false,
      };
    } else if (
      createTitleDeedApplicationReviewDto.action == 'BASE_MAP_APPROVAL'
    ) {
      applicationCondition = {
        submitted: true,
        verified: true,
        base_map_approved: false,
      };
    } else if (createTitleDeedApplicationReviewDto.action == 'AUTHORIZATION') {
      applicationCondition = {
        authorized: false,
        submitted: true,
        plot_registered: true,
      };
    }

    const existingApplication =
      await this.prisma.titleDeedApplicationReview.findFirst({
        where: {
          employee_id: employee.id,
          completed: false,
          titleDeedApplication: {
            // titleDeedApplicationIssues: {
            //   none: { OR: [{ resolved: false }, { resolved: null }] },
            // },
            ...applicationCondition,
          },
        },
        select: {
          id: true,
        },
      });

    if (existingApplication) return existingApplication;

    const application = await this.prisma.titleDeedApplication.findFirst({
      where: {
        ...applicationCondition,
        submitted: true,
        titleDeedApplicationReviews: {
          none: { completed: false },
        },
      },
    });

    if (!application) {
      throw new HttpException(
        'No new application found. Please try again later.',
        422,
      );
    }

    return this.prisma.titleDeedApplicationReview.create({
      data: {
        role: createTitleDeedApplicationReviewDto.action,
        assignment_note: 'ASSIGNED BY REQUEST',
        employee_id: employee.id,
        title_deed_application_id: application.id,
      },
      select: {
        id: true,
      },
    });
  }

  // async createManual(
  //   request: EmployeeTokenClaim,
  //   createManualTitleDeedApplicationReviewDto: CreateManualTitleDeedApplicationReviewDto,
  // ) {
  //   const employee = await this.prisma.employee.findUnique({
  //     where: { id: request.user.sub },
  //   });

  //   if (!employee) {
  //     throw new HttpException('Invalid Employee', 422);
  //   }

  //   const titleDeedApplication =
  //     await this.prisma.titleDeedApplication.findFirst({
  //       where: {
  //         submitted: true,
  //         // titleDeedApplicationIssues: {
  //         //   none: { OR: [{ resolved: false }, { resolved: null }] },
  //         // },
  //         application_no:
  //           createManualTitleDeedApplicationReviewDto.application_no,
  //       },
  //       select: {
  //         id: true,
  //         verified: true,
  //         authorized: true,
  //         _count: {
  //           select: {
  //             titleDeedApplicationReviews: {
  //               where: {
  //                 completed: null,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //   if (!titleDeedApplication) {
  //     throw new HttpException(
  //       'No new application found. Please try again later.',
  //       422,
  //     );
  //   }

  //   if (createManualTitleDeedApplicationReviewDto.action == 'VERIFICATION') {
  //     if (titleDeedApplication.verified) {
  //       throw new HttpException('Application Already verified', 422);
  //     }
  //   } else if (
  //     createManualTitleDeedApplicationReviewDto.action == 'AUTHORIZATION'
  //   ) {
  //     if (!titleDeedApplication.verified) {
  //       throw new HttpException('Application not verified', 422);
  //     } else if (titleDeedApplication.authorized) {
  //       throw new HttpException('Application Already authorized', 422);
  //     }
  //   }

  //   const existingApplication =
  //     await this.prisma.titleDeedApplicationReview.findFirst({
  //       where: {
  //         employee_id: employee.id,
  //         completed: null,
  //         titleDeedApplication: {
  //           application_no:
  //             createManualTitleDeedApplicationReviewDto.application_no,
  //         },
  //       },
  //       select: {
  //         id: true,
  //       },
  //     });

  //   if (existingApplication) return existingApplication;

  //   if (!titleDeedApplication) {
  //     throw new HttpException(
  //       'No new application found. Please try again later.',
  //       422,
  //     );
  //   }

  //   if (titleDeedApplication._count.titleDeedApplicationReviews > 0) {
  //     await this.prisma.titleDeedApplicationReview.updateMany({
  //       where: {
  //         title_deed_application_id: titleDeedApplication.id,
  //         completed: null,
  //       },
  //       data: {
  //         completed: true,
  //         completed_by_id: employee.id,
  //         completed_at: new Date(),
  //         note: `Reassigned to another employee: ${employee.full_name}`,
  //       },
  //     });
  //   }

  //   return this.prisma.titleDeedApplicationReview.create({
  //     data: {
  //       assignment_note: 'ASSIGNED BY MANUAL REQUEST',
  //       employee_id: employee.id,
  //       title_deed_application_id: titleDeedApplication.id,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  // }

  async findOne(id: string) {
    const titleDeedApplicationReview =
      await this.prisma.titleDeedApplicationReview.findUnique({
        where: {
          id: id,
        },
        include: {
          titleDeedApplication: {
            include: {
              titleDeedService: {
                select: {
                  id: true,
                  name: true,
                  name_json: true,
                },
              },
              verifiedBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
              rejectedBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
              authorizedBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
              rejectionReason: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

    if (!titleDeedApplicationReview) {
      throw new NotFoundException();
    }

    const has_issue = false;
    //  = await this.prisma.titleDeedApplicationIssue.findFirst({
    //   where: {
    //     title_deed_application_id:
    //       titleDeedApplicationReview.title_deed_application_id,
    //     OR: [{ resolved: false }, { resolved: null }],
    //   },
    //   select: {
    //     id: true,
    //   },
    // });

    return { has_issue, ...titleDeedApplicationReview };
  }

  async findAllPaginated(options: SearchTitleDeedApplicationReviewDto) {
    const { search, reviewer_id, role } = { ...options };
    const where: any = {};

    if (search) {
      where.titleDeedApplication = {
        application_no: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    if (reviewer_id) {
      const employee = await this.prisma.employee.findUnique({
        where: { id: reviewer_id },
      });

      where.employee_id = employee.id;
    }

    if (role) {
      where.role = role;
    }

    return paginate(
      this.prisma.titleDeedApplicationReview,
      {
        where,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          completed: true,
          completed_at: true,
          created_at: true,
          titleDeedApplication: {
            select: {
              id: true,
              application_no: true,
              created_at: true,
              titleDeedService: {
                select: {
                  id: true,
                  name: true,
                  name_json: true,
                },
              },
            },
          },
        },
      },
      { page: +options.page, perPage: +options.limit },
    );
  }

  async verify(
    id: string,
    data: VerifyTitleDeedApplicationReviewDto,
    request: EmployeeTokenClaim,
  ) {
    const titleDeedApplicationReview =
      await this.prisma.titleDeedApplicationReview.findUnique({
        where: { id: id },
      });

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('', 422);
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.titleDeedApplicationReview.update({
        where: { id: id },
        data: {
          completed: true,
          note: data.verifier_note,
          completed_by_id: employee.id,
          completed_at: new Date(),
        },
      });

      await tx.titleDeedApplication.update({
        where: {
          id: titleDeedApplicationReview.title_deed_application_id,
        },
        data: {
          verified: true,
          verifier_note: data.verifier_note,
          verified_by_id: employee.id,
          verified_at: new Date(),
        },
      });
    });

    return {
      data: titleDeedApplicationReview,
      message: this.i18n.t('success-messages.resource-verified', {
        args: {
          Resource: 'title-deed-application',
        },
      }),
    };
  }

  async authorize(
    id: string,
    data: AuthorizeTitleDeedApplicationReviewDto,
    request: EmployeeTokenClaim,
  ) {
    const titleDeedApplicationReview =
      await this.prisma.titleDeedApplicationReview.findUnique({
        where: { id: id },
      });

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('', 422);
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.titleDeedApplicationReview.update({
        where: { id: id },
        data: {
          completed: true,
          note: data.authorizer_note,
          completed_by_id: employee.id,
          completed_at: new Date(),
        },
      });

      await tx.titleDeedApplication.update({
        where: {
          id: titleDeedApplicationReview.title_deed_application_id,
        },
        data: {
          authorized: true,
          authorizer_note: data.authorizer_note,
          authorized_by_id: employee.id,
          authorized_at: new Date(),
        },
      });
    });

    return {
      data: titleDeedApplicationReview,
      message: this.i18n.t('success-messages.resource-authorized', {
        args: {
          Resource: 'title-deed-application',
        },
      }),
    };
  }

  async requireAppointment(
    id: string,
    data: AppointmentTitleDeedApplicationReviewDto,
    request: EmployeeTokenClaim,
  ) {
    const titleDeedApplicationReview =
      await this.prisma.titleDeedApplicationReview.findUnique({
        where: { id: id },
      });

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('', 422);
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.titleDeedApplicationReview.update({
        where: { id: id },
        data: {
          completed: true,
          note: data.appointment_note,
          completed_by_id: employee.id,
          completed_at: new Date(),
        },
      });

      await tx.titleDeedApplication.update({
        where: {
          id: titleDeedApplicationReview.title_deed_application_id,
        },
        data: {
          appointment_required: true,
          appointment_required_by_id: employee.id,
          appointment_required_at: new Date(),
        },
      });
    });

    return {
      data: titleDeedApplicationReview,
      message: 'Appointment Sent To Client',
    };
  }

  async reject(
    id: string,
    data: RejectTitleDeedApplicationReviewDto,
    request: EmployeeTokenClaim,
  ) {
    const titleDeedApplicationReview =
      await this.prisma.titleDeedApplicationReview.findUnique({
        where: { id: id },
      });

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('', 422);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.titleDeedApplicationReview.update({
        where: { id: id },
        data: {
          completed: true,
          note: data.rejecter_note,
          completed_by_id: employee.id,
          completed_at: new Date(),
        },
      });

      const oldTitleDeedApplicationReview =
        await tx.titleDeedApplicationReview.findFirst({
          where: {
            title_deed_application_id:
              titleDeedApplicationReview.title_deed_application_id,
            role: data.role,
          },
          orderBy: { created_at: 'desc' },
          select: { id: true, employee_id: true },
        });

      let applicationCondition: any = {};

      if (data.role == 'ARCHIVE') {
        applicationCondition = {
          archived: false,
        };
      } else if (data.role == 'VERIFICATION') {
        applicationCondition = {
          verified: false,
        };
      } else if (data.role == 'PLOT_REGISTRATION') {
        applicationCondition = {
          plot_registered: false,
        };
      } else if (data.role == 'BASE_MAP_APPROVAL') {
        applicationCondition = {
          base_map_approved: false,
        };
      } else if (data.role == 'AUTHORIZATION') {
        applicationCondition = {
          authorized: false,
        };
      } else {
        applicationCondition = {
          submitted: false,
        };
      }

      await tx.titleDeedApplication.update({
        where: {
          id: titleDeedApplicationReview.title_deed_application_id,
        },
        data: {
          ...applicationCondition,
          rejected: true,
          rejecter_note: data.rejecter_note,
          rejection_reason_id: data.rejection_reason_id || null,
          rejected_by_id: employee.id,
          rejected_at: new Date(),
        },
      });

      if (oldTitleDeedApplicationReview) {
        return this.prisma.titleDeedApplicationReview.create({
          data: {
            role: data.role,
            reapplied: true,
            assignment_note: data.rejecter_note,
            employee_id: oldTitleDeedApplicationReview.employee_id,
            title_deed_application_id:
              titleDeedApplicationReview.title_deed_application_id,
          },
          select: {
            id: true,
          },
        });
      }
    });

    return {
      data: titleDeedApplicationReview,
      message: 'New Reviewer Assigned',
    };
  }

  async close(id: string, request: EmployeeTokenClaim, data: { note: string }) {
    const titleDeedApplicationReview =
      await this.prisma.titleDeedApplicationReview.findUnique({
        where: { id: id },
      });

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('Unauthorized!', 422);
    }

    await this.prisma.titleDeedApplicationReview.update({
      where: { id: id },
      data: {
        completed: true,
        note: 'CLOSED BY EMPLOYEE',
        completed_by_id: employee.id,
        completed_at: new Date(),
      },
    });

    return {
      data: titleDeedApplicationReview,
      message: 'Assignment Closed Successfully',
    };
  }

  async archive(
    id: string,
    archiveTitleDeedApplicationReviewDto: ArchiveTitleDeedApplicationReviewDto,
    request: EmployeeTokenClaim,
  ) {
    const titleDeedApplicationReview =
      await this.prisma.titleDeedApplicationReview.findUnique({
        where: {
          id: id,
        },
        select: {
          titleDeedApplication: {
            select: {
              title_deed_service_id: true,
              submitted: true,
              archived: true,
              id: true,
            },
          },
        },
      });

    if (!titleDeedApplicationReview) {
      throw new HttpException(
        this.i18n.t('error-messages.invalid-resource', {
          args: { Resource: 'title-deed-application' },
        }),
        422,
      );
    }

    if (!titleDeedApplicationReview.titleDeedApplication.submitted) {
      throw new HttpException(
        this.i18n.t('error-messages.not-submitted', {
          args: { Resource: 'title-deed-application' },
        }),
        422,
      );
    }

    if (titleDeedApplicationReview.titleDeedApplication.archived) {
      throw new HttpException(
        this.i18n.t('error-messages.already-verified', {
          args: { Resource: 'title-deed-application' },
        }),
        422,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.titleDeedApplicationReview.update({
        where: { id: id },
        data: {
          completed: true,
          note: archiveTitleDeedApplicationReviewDto.archive_note,
          completed_by_id: request.user.sub,
          completed_at: new Date(),
        },
      });

      await tx.titleDeedApplication.update({
        where: {
          id: titleDeedApplicationReview.titleDeedApplication.id,
        },
        data: {
          archived: true,
          archive_note: archiveTitleDeedApplicationReviewDto.archive_note,
          archived_by_id: request.user.sub,
          archived_at: new Date(),
        },
      });
    });

    return {
      data: titleDeedApplicationReview,
      message: 'Archive action completed!',
    };
  }
}
