import { BadRequestException, Injectable } from '@nestjs/common';
import { Employee, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { DatabaseService } from 'src/common/database/database.service';
import { MinioClientService } from 'src/common/minio-client/minio-client.service';
import { generateCode } from 'src/common/utils/generate-code';
import { paginate } from 'src/common/utils/paginater';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CreateEmployeeDto, SearchEmployeeDto, UpdateEmployeeDto } from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly minioClientService: MinioClientService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    data: CreateEmployeeDto,
    request: EmployeeTokenClaim,
  ): Promise<Employee> {
    data.password = await bcrypt.hash(data.password, 10);

    //generate a 6 digit random string
    const code = generateCode(6);

    //hash the code
    const codeHash = await bcrypt.hash(code, 10);

    return await this.prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          password: data.password,
          name: data.name,
          phone_number: data.phone_number,
          username: data.username,
          code_hash: codeHash,
          created_by_id: request.user.sub,
        },
      });

      await tx.employeeRole.createMany({
        data: [
          {
            role_id: data.role_id,
            employee_id: employee.id,
          },
        ],
      });

      return employee;
    });
  }

  async update(
    id: string,
    data: UpdateEmployeeDto,
    files: any,
  ): Promise<Employee> {
    let signature_path: any = {};
    let photo_path: any = {};

    if (files?.signature_file && files?.signature_file[0]) {
      signature_path = await this.minioClientService.uploadSingleFile(
        files.signature_file[0],
        'EMPLOYEE',
      );
    }

    if (files?.photo_file && files?.photo_file[0]) {
      photo_path = await this.minioClientService.uploadSingleFile(
        files.photo_file[0],
        'EMPLOYEE',
      );
    }

    const employee = await this.prisma.employee.update({
      data: {
        name: data.name,
        ...(Object.keys(signature_path).length > 0
          ? { signature_url: signature_path }
          : {}),
        ...(Object.keys(photo_path).length > 0
          ? { photo_url: photo_path }
          : {}),
        ...(data.branch_id && {
          branch_id: data.branch_id,
          accept_abroad_request: data.accept_abroad_request,
        }),
        updated_by_id: data.updated_by_id,
      },
      where: { id: id },
    });

    return employee;
  }

  async findAllPaginated(options: SearchEmployeeDto) {
    const { search, department_role_id, department_id } = { ...options };
    const where: any = {};

    if (department_role_id) {
      where.employeeRoles = {
        some: {
          department_role_id: department_role_id,
        },
      };
    }

    if (department_role_id) {
      where.employeeRoles = {
        some: {
          department_role_id: department_role_id,
        },
      };
    }

    if (department_id) {
      where.employeeRoles = {
        some: {
          departmentRole: {
            department_id: department_id,
          },
        },
      };
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search, // Use 'contains' for a case-insensitive search
            mode: 'insensitive', // Ensure the search is case-insensitive
          },
        },
        {
          employee: {
            username: {
              contains: search, // Use 'contains' for a case-insensitive search
              mode: 'insensitive', // Ensure the search is case-insensitive
            },
          },
        },
      ];
    }

    return paginate(
      this.prisma.employee,
      {
        where,
        orderBy: { created_at: 'desc' },
        include: {
          employeeRoles: {
            select: {
              id: true,
              role: { select: { id: true, name: true } },
            },
          },
        },
      },
      { page: options.page, perPage: options.limit },
    );
  }

  findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: { id: id },
      include: {
        employeeRoles: {
          select: {
            id: true,
            role: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.employee.delete({
      where: { id: id },
    });
  }
}
