import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EmployeeLoginDto } from './dto';
import { DatabaseService } from 'src/common/database/database.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  AuthPermission,
  EmployeeTokenClaim,
  IEmployeeLogin,
  IUserRole,
} from 'src/common/interfaces/employee-login.interface';

@Injectable()
export class EmployeeAuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async login(loginDto: EmployeeLoginDto, ip_address: string) {
    const user: any = await this.getEmployeeLoginDetail(loginDto.username);

    user.resourcePermissions = await this.convertRolePermissions(user.id);

    if (!user) {
      throw new HttpException(
        this.i18n.t('error-messages.unauthorized-and-not-found', {
          args: { Resource: 'user' },
        }),
        401,
      );
    }

    if (!user.is_active) {
      throw new HttpException(
        this.i18n.t('error-messages.is-inactive', {
          args: { Resource: 'user' },
        }),
        401,
      );
    }

    if (user.is_suspended) {
      throw new HttpException(
        this.i18n.t('error-messages.is-suspended', {
          args: { Resource: 'user' },
        }),
        401,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        this.i18n.t('error-messages.auth.invalid-credentials'),
        401,
      );
    }

    if (loginDto?.lat && loginDto?.long) {
      await this.prisma.employeeLoginHistory.create({
        data: {
          employee_id: user.id,
          ip_address,
          lat: loginDto.lat,
          lng: loginDto.long,
        },
      });
    }

    return this.generateJwtToken(user);
  }

  async me(token: EmployeeTokenClaim) {
    const user = await this.getEmployeeLoginDetail(token.user.username);

    const resourcePermissions = await this.convertRolePermissions(user.id);

    return { ...user, resourcePermissions, server_time: new Date() };
  }

  async refreshToken(token: EmployeeTokenClaim) {
    if (!token.user.username) {
      throw new UnauthorizedException(
        this.i18n.t('error-messages.auth.invalid-token'),
      );
    }
    const user = await this.getEmployeeLoginDetail(token.user.username);
    if (user) return this.generateJwtToken(user);
  }

  async getEmployeeLoginDetail(username: string) {
    return await this.prisma.employee.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        password: true,
        email: true,
        require_password_change: true,
        is_active: true,
        is_suspended: true,
      },
    });
  }

  private async convertRolePermissions(employee_id) {
    const rolePermissionResources =
      await this.prisma.rolePermissionResource.findMany({
        where: {
          role: { employeeRoles: { some: { employee_id: employee_id } } },
        },
        select: {
          rolePermissionResourceActions: {
            select: {
              permissionAction: {
                select: { id: true, action: true },
              },
            },
          },
          permissionResource: {
            select: {
              name: true,
            },
          },
        },
      });

    return rolePermissionResources.map((rolePermissionResource) => {
      return {
        resource: rolePermissionResource.permissionResource.name,
        permissions: rolePermissionResource.rolePermissionResourceActions.map(
          (rolePermissionResourceAction) => {
            return rolePermissionResourceAction.permissionAction.action;
          },
        ),
      };
    });
  }

  private async generateJwtToken<
    T extends IEmployeeLogin | Partial<IEmployeeLogin>,
  >(
    user: T,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: T;
  }> {
    const jwtPayload: {
      sub: string;
      username: string;
      resourcePermissions?: AuthPermission[];
      license_application_id?: string;
      username_verified: boolean;
      language: string;
    } = {
      sub: user.id || '',
      username: user.username || '',
      username_verified: user.username_verified || false,
      language: 'en',
    };

    if ('userRoles' in user && user.userRoles) {
      jwtPayload.resourcePermissions = user.resourcePermissions;
    }

    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: '1145m',
    });

    const refreshToken = this.jwtService.sign(
      {
        username: user.username,
      },
      {
        expiresIn: '11h',
      },
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
