import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { AuthorizationService } from 'src/common/services/authorization.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly authorizationService: AuthorizationService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    currentEmployee: EmployeeTokenClaim,
  ): Promise<EmployeeResponseDto> {
    // Check if current employee is super admin or branch employee
    const currentEmployeeRoles =
      await this.authorizationService.getEmployeeRoles(
        currentEmployee.user.sub,
      );

    // const isSuperAdmin = currentEmployeeRoles.some(
    //   (role) => role.role.name === 'super_admin',
    // );

    const isSuperAdmin = true;

    // If not super admin, check if they can only create employees for their branch
    if (!isSuperAdmin) {
      const currentEmployeeData = await this.prisma.employee.findUnique({
        where: { id: currentEmployee.user.sub },
        select: { branch_id: true },
      });

      if (!currentEmployeeData?.branch_id) {
        throw new ForbiddenException(
          this.i18n.t('error-messages.unauthorized-action'),
        );
      }

      // If creating employee for a different branch, deny
      if (
        createEmployeeDto.branch_id &&
        createEmployeeDto.branch_id !== currentEmployeeData.branch_id
      ) {
        throw new ForbiddenException(
          this.i18n.t('error-messages.unauthorized-action'),
        );
      }

      // Force the branch_id to be the same as current employee's branch
      createEmployeeDto.branch_id = currentEmployeeData.branch_id;
    }

    // Check if username already exists
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { username: createEmployeeDto.username },
    });

    if (existingEmployee) {
      throw new ConflictException(
        this.i18n.t('error-messages.already-exists', {
          args: { Resource: 'username' },
        } as any),
      );
    }

    // Check if phone number already exists
    const existingPhone = await this.prisma.employee.findUnique({
      where: { phone_number: createEmployeeDto.phone_number },
    });

    if (existingPhone) {
      throw new ConflictException(
        this.i18n.t('error-messages.already-exists', {
          args: { Resource: 'phone number' },
        } as any),
      );
    }

    // Check if email already exists (if provided)
    if (createEmployeeDto.email) {
      const existingEmail = await this.prisma.employee.findUnique({
        where: { email: createEmployeeDto.email },
      });

      if (existingEmail) {
        throw new ConflictException(
          this.i18n.t('error-messages.already-exists', {
            args: { Resource: 'email' },
          } as any),
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);

    // Create employee
    const employee = await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        password: hashedPassword,
        created_by_id: currentEmployee.user.sub,
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        employeeRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return plainToInstance(EmployeeResponseDto, employee, {
      groups: ['me'],
    });
  }

  async findAll(
    currentEmployee: EmployeeTokenClaim,
    branchId?: string,
  ): Promise<EmployeeResponseDto[]> {
    // Check if current employee is super admin or branch employee
    const currentEmployeeRoles =
      await this.authorizationService.getEmployeeRoles(
        currentEmployee.user.sub,
      );

    // const isSuperAdmin = currentEmployeeRoles.some(
    //   (role) => role.role.name === 'super_admin',
    // );

    const isSuperAdmin = true;

    let whereClause: any = {};

    // If not super admin, only show employees from their branch
    if (!isSuperAdmin) {
      const currentEmployeeData = await this.prisma.employee.findUnique({
        where: { id: currentEmployee.user.sub },
        select: { branch_id: true },
      });

      if (!currentEmployeeData?.branch_id) {
        throw new ForbiddenException(
          this.i18n.t('error-messages.unauthorized-action'),
        );
      }

      whereClause.branch_id = currentEmployeeData.branch_id;
    } else if (branchId) {
      // Super admin can filter by branch
      whereClause.branch_id = branchId;
    }

    const employees = await this.prisma.employee.findMany({
      where: whereClause,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        employeeRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return plainToInstance(EmployeeResponseDto, employees, {
      groups: ['me'],
    });
  }

  async findOne(
    id: string,
    currentEmployee: EmployeeTokenClaim,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        employeeRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(
        this.i18n.t('error-messages.not-found', {
          args: { Resource: 'employee' },
        } as any),
      );
    }

    // Check if current employee is super admin or can view this specific employee
    const currentEmployeeRoles =
      await this.authorizationService.getEmployeeRoles(
        currentEmployee.user.sub,
      );

    // const isSuperAdmin = currentEmployeeRoles.some(
    //   (role) => role.role.name === 'super_admin',
    // );
    const isSuperAdmin = true;

    if (!isSuperAdmin) {
      const currentEmployeeData = await this.prisma.employee.findUnique({
        where: { id: currentEmployee.user.sub },
        select: { branch_id: true },
      });

      if (
        !currentEmployeeData?.branch_id ||
        employee.branch_id !== currentEmployeeData.branch_id
      ) {
        throw new ForbiddenException(
          this.i18n.t('error-messages.unauthorized-action'),
        );
      }
    }

    return plainToInstance(EmployeeResponseDto, employee, {
      groups: ['me'],
    });
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    currentEmployee: EmployeeTokenClaim,
  ): Promise<EmployeeResponseDto> {
    // Check if employee exists
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id },
      select: { branch_id: true },
    });

    if (!existingEmployee) {
      throw new NotFoundException(
        this.i18n.t('error-messages.not-found', {
          args: { Resource: 'employee' },
        } as any),
      );
    }

    // Check if current employee is super admin or can update this specific employee
    const currentEmployeeRoles =
      await this.authorizationService.getEmployeeRoles(
        currentEmployee.user.sub,
      );

    // const isSuperAdmin = currentEmployeeRoles.some(
    // (role) => role.role.name === 'super_admin',
    // );

    const isSuperAdmin = true;

    if (!isSuperAdmin) {
      const currentEmployeeData = await this.prisma.employee.findUnique({
        where: { id: currentEmployee.user.sub },
        select: { branch_id: true },
      });

      if (
        !currentEmployeeData?.branch_id ||
        existingEmployee.branch_id !== currentEmployeeData.branch_id
      ) {
        throw new ForbiddenException(
          this.i18n.t('error-messages.unauthorized-action'),
        );
      }

      // Branch employees cannot change branch assignment
      if (updateEmployeeDto.branch_id) {
        delete updateEmployeeDto.branch_id;
      }
    }

    // Check for unique constraints if updating username, phone, or email
    if (updateEmployeeDto.username) {
      const existingUsername = await this.prisma.employee.findFirst({
        where: {
          username: updateEmployeeDto.username,
          id: { not: id },
        },
      });

      if (existingUsername) {
        throw new ConflictException(
          this.i18n.t('error-messages.already-exists', {
            args: { Resource: 'username' },
          } as any),
        );
      }
    }

    if (updateEmployeeDto.phone_number) {
      const existingPhone = await this.prisma.employee.findFirst({
        where: {
          phone_number: updateEmployeeDto.phone_number,
          id: { not: id },
        },
      });

      if (existingPhone) {
        throw new ConflictException(
          this.i18n.t('error-messages.already-exists', {
            args: { Resource: 'phone number' },
          } as any),
        );
      }
    }

    if (updateEmployeeDto.email) {
      const existingEmail = await this.prisma.employee.findFirst({
        where: {
          email: updateEmployeeDto.email,
          id: { not: id },
        },
      });

      if (existingEmail) {
        throw new ConflictException(
          this.i18n.t('error-messages.already-exists', {
            args: { Resource: 'email' },
          } as any),
        );
      }
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (updateEmployeeDto.password) {
      hashedPassword = await bcrypt.hash(updateEmployeeDto.password, 10);
    }

    // Prepare update data
    const updateData: any = { ...updateEmployeeDto };
    if (hashedPassword) {
      updateData.password = hashedPassword;
    }
    delete updateData.password; // Remove the plain password

    updateData.updated_by_id = currentEmployee.user.sub;

    // Update employee
    const employee = await this.prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        employeeRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return plainToInstance(EmployeeResponseDto, employee, {
      groups: ['me'],
    });
  }

  async remove(id: string, currentEmployee: EmployeeTokenClaim): Promise<void> {
    // Check if employee exists
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id },
      select: { branch_id: true },
    });

    if (!existingEmployee) {
      throw new NotFoundException(
        this.i18n.t('error-messages.not-found', {
          args: { Resource: 'employee' },
        } as any),
      );
    }

    // Check if current employee is super admin or can delete this specific employee
    const currentEmployeeRoles =
      await this.authorizationService.getEmployeeRoles(
        currentEmployee.user.sub,
      );

    const isSuperAdmin = currentEmployeeRoles.some(
      (role) => role.role.name === 'super_admin',
    );

    if (!isSuperAdmin) {
      const currentEmployeeData = await this.prisma.employee.findUnique({
        where: { id: currentEmployee.user.sub },
        select: { branch_id: true },
      });

      if (
        !currentEmployeeData?.branch_id ||
        existingEmployee.branch_id !== currentEmployeeData.branch_id
      ) {
        throw new ForbiddenException(
          this.i18n.t('error-messages.unauthorized-action'),
        );
      }
    }

    // Prevent self-deletion
    if (id === currentEmployee.user.sub) {
      throw new ForbiddenException(
        this.i18n.t('error-messages.unauthorized-action'),
      );
    }

    await this.prisma.employee.delete({
      where: { id },
    });
  }
}
