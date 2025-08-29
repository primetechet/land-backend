import { Injectable, HttpException } from '@nestjs/common';
import {
  CreateTitleDeedApplicationOwnerDto,
  UpdateTitleDeedApplicationOwnerDto,
  SearchTitleDeedApplicationOwnerDto,
  VerifyTitleDeedApplicationOwnerDto,
  RejectTitleDeedApplicationOwnerDto,
} from './dto';
import { TitleDeedApplicationOwner } from '@prisma/client';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@Injectable()
export class TitleDeedApplicationOwnerService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(
    data: CreateTitleDeedApplicationOwnerDto,
  ): Promise<TitleDeedApplicationOwner> {
    // First, validate that the title deed application exists
    const titleDeedApplication =
      await this.prisma.titleDeedApplication.findUnique({
        where: { id: data.title_deed_application_id },
      });

    if (!titleDeedApplication) {
      throw new HttpException('Title deed application not found', 404);
    }

    // Check if the same person (by ID number) already exists for this application
    const existingOwner = await this.prisma.titleDeedApplicationOwner.findFirst(
      {
        where: {
          title_deed_application_id: data.title_deed_application_id,
          id_number: data.id_number,
        },
      },
    );

    if (existingOwner) {
      // If the person exists and is verified, reject
      if (existingOwner.verified) {
        throw new HttpException(
          'This person is already verified as an owner for this application',
          422,
        );
      }

      // If the person exists and is in pending state (both false), reject
      if (!existingOwner.verified && !existingOwner.rejected) {
        throw new HttpException(
          'This person is already registered as an owner for this application and is pending verification',
          422,
        );
      }

      // If the person was previously rejected, allow creation (they can try again)
    }

    return this.prisma.titleDeedApplicationOwner.create({
      data: {
        is_organization: data.is_organization,
        is_representative: data.is_representative,
        id_type: data.id_type,
        id_number: data.id_number,
        is_applicant: data.is_applicant,
        first_name: data.first_name,
        father_name: data.father_name,
        grand_father_name: data.grand_father_name,
        first_name_am: data.first_name_am,
        father_name_am: data.father_name_am,
        grand_father_name_am: data.grand_father_name_am,
        mother_first_name: data.mother_first_name,
        mother_father_name: data.mother_father_name,
        mother_grand_father_name: data.mother_grand_father_name,
        mother_first_name_am: data.mother_first_name_am,
        mother_father_name_am: data.mother_father_name_am,
        mother_grand_father_name_am: data.mother_grand_father_name_am,
        gender: data.gender,
        house_number: data.house_number,
        title_deed_application_id: data.title_deed_application_id,
        disability_status_id: data.disability_status_id,
        nationality_id: data.nationality_id,
        residency_country_id: data.residency_country_id,
        woreda_id: data.woreda_id,
        remark: data.remark,
      },
    });
  }

  async update(
    id: string,
    data: UpdateTitleDeedApplicationOwnerDto,
  ): Promise<TitleDeedApplicationOwner> {
    return this.prisma.titleDeedApplicationOwner.update({
      where: { id },
      data,
    });
  }

  findAll(options: SearchTitleDeedApplicationOwnerDto) {
    const { search, title_deed_application_id } = { ...options };
    const where: any = {};

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { father_name: { contains: search, mode: 'insensitive' } },
        { grand_father_name: { contains: search, mode: 'insensitive' } },
        { id_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (title_deed_application_id)
      where.title_deed_application_id = title_deed_application_id;

    return this.prisma.titleDeedApplicationOwner.findMany({
      where,
      select: {
        id: true,
        is_organization: true,
        is_representative: true,
        id_type: true,
        id_number: true,
        is_applicant: true,
        first_name: true,
        father_name: true,
        grand_father_name: true,
        gender: true,
        house_number: true,
        title_deed_application_id: true,
        disability_status_id: true,
        nationality_id: true,
        residency_country_id: true,
        woreda_id: true,
        verified: true,
        rejected: true,
        verified_at: true,
        rejected_at: true,
        verifier_note: true,
        rejecter_note: true,
        nationality: {
          select: {
            id: true,
            name: true,
          },
        },
        woreda: {
          select: {
            id: true,
            name: true,
            district: {
              select: {
                id: true,
                name: true,
                region: { select: { id: true, name: true } },
              },
            },
          },
        },
        remark: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findAllPaginated(options: SearchTitleDeedApplicationOwnerDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { father_name: { contains: search, mode: 'insensitive' } },
        { grand_father_name: { contains: search, mode: 'insensitive' } },
        { id_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    return paginate(
      this.prisma.titleDeedApplicationOwner,
      { where },
      { page: +options.page, perPage: +options.limit },
    );
  }

  findOne(id: string) {
    return this.prisma.titleDeedApplicationOwner.findUnique({
      where: { id },
      select: {
        id: true,
        is_organization: true,
        id_type: true,
        id_number: true,
        is_applicant: true,
        first_name: true,
        father_name: true,
        grand_father_name: true,
        gender: true,
        house_number: true,
        remark: true,
        verified: true,
        rejected: true,
        verified_at: true,
        rejected_at: true,
        verifier_note: true,
        rejecter_note: true,
        titleDeedApplication: { select: { id: true, title_deed_number: true } },
        disabilityStatus: { select: { id: true, name: true } },
        nationality: { select: { id: true, name: true } },
        residencyCountry: { select: { id: true, name: true } },
        woreda: { select: { id: true, name: true } },
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findVerifiedOwnerByApplicationId(titleDeedApplicationId: string) {
    return this.prisma.titleDeedApplicationOwner.findFirst({
      where: {
        title_deed_application_id: titleDeedApplicationId,
        verified: true,
      },
      select: {
        id: true,
        is_organization: true,
        id_type: true,
        id_number: true,
        is_applicant: true,
        first_name: true,
        father_name: true,
        grand_father_name: true,
        gender: true,
        house_number: true,
        remark: true,
        verified: true,
        verified_at: true,
        verifier_note: true,
        nationality: { select: { id: true, name: true } },
        woreda: { select: { id: true, name: true } },
        created_at: true,
        updated_at: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.titleDeedApplicationOwner.delete({ where: { id } });
  }

  async verify(
    id: string,
    data: VerifyTitleDeedApplicationOwnerDto,
    request: EmployeeTokenClaim,
  ) {
    const titleDeedApplicationOwner =
      await this.prisma.titleDeedApplicationOwner.findUnique({
        where: { id },
        include: {
          titleDeedApplication: true,
        },
      });

    if (!titleDeedApplicationOwner) {
      throw new HttpException('Owner not found', 404);
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('Employee not found', 422);
    }

    // Check if there's already a verified owner for this application with the same ID number
    const existingVerifiedOwner =
      await this.prisma.titleDeedApplicationOwner.findFirst({
        where: {
          title_deed_application_id:
            titleDeedApplicationOwner.title_deed_application_id,
          id_number: titleDeedApplicationOwner.id_number,
          verified: true,
          rejected: false,
          id: { not: id }, // Exclude current owner
        },
      });

    if (existingVerifiedOwner) {
      throw new HttpException(
        'This person is already verified as an owner for this application',
        422,
      );
    }

    // Check if there's another owner in pending state (both false) for this application
    const existingPendingOwner =
      await this.prisma.titleDeedApplicationOwner.findFirst({
        where: {
          title_deed_application_id:
            titleDeedApplicationOwner.title_deed_application_id,
          verified: false,
          rejected: false,
          id: { not: id }, // Exclude current owner
        },
      });

    if (existingPendingOwner) {
      throw new HttpException(
        'There is already a pending owner for this application. Please verify or reject the existing owner first.',
        422,
      );
    }

    await this.prisma.titleDeedApplicationOwner.update({
      where: { id },
      data: {
        rejected: false,
        verified: true,
        verifier_note: data.verifier_note,
        verified_by_id: employee.id,
        verified_at: new Date(),
      },
    });

    return {
      data: titleDeedApplicationOwner,
      message: 'Owner verified successfully',
    };
  }

  async reject(
    id: string,
    data: RejectTitleDeedApplicationOwnerDto,
    request: EmployeeTokenClaim,
  ) {
    const titleDeedApplicationOwner =
      await this.prisma.titleDeedApplicationOwner.findUnique({
        where: { id },
      });

    if (!titleDeedApplicationOwner) {
      throw new HttpException('Owner not found', 404);
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('Employee not found', 422);
    }

    await this.prisma.titleDeedApplicationOwner.update({
      where: { id },
      data: {
        verified: false,
        rejected: true,
        rejecter_note: data.rejecter_note,
        rejection_reason_id: data.rejection_reason_id,
        rejected_by_id: employee.id,
        rejected_at: new Date(),
      },
    });

    return {
      data: titleDeedApplicationOwner,
      message: 'Owner rejected successfully',
    };
  }
}
