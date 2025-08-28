import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { DatabaseService } from 'src/common/database/database.service';
import { paginate } from 'src/common/utils/paginater';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CreateEmployeeRoleDto } from './dto';

@Injectable()
export class EmployeeRoleService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}
  async create({ role_id, employee_id }: CreateEmployeeRoleDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employee_id },
    });
    if (!employee) {
      throw new NotFoundException(
        this.i18n.t('error-messages.not-found', {
          args: {
            Resource: 'employee',
          },
        }),
      );
    }

    const role = await this.prisma.role.findUnique({ where: { id: role_id } });
    if (!role) {
      throw new NotFoundException(
        this.i18n.t('error-messages.not-found', {
          args: {
            Resource: 'role',
          },
        }),
      );
    }

    const existingEmployeeRole = await this.prisma.employeeRole.findFirst({
      where: { role_id, employee_id },
    });

    if (existingEmployeeRole) {
      throw new BadRequestException(
        this.i18n.t('error-messages.already-exists', {
          args: {
            Resource: 'employee-role',
          },
        }),
      );
    }
    return this.prisma.employeeRole.create({
      data: {
        employee_id,
        role_id,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.employeeRole.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.employeeRole.delete({ where: { id } });
  }
}
