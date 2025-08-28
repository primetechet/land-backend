import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  EmployeeLoginDto,
  EmployeeResponseDto,
  EmployeeLoginResponseDto,
} from './dto';
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
import { AuthorizationService } from 'src/common/services/authorization.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EmployeeAuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async login(
    loginDto: EmployeeLoginDto,
    ip_address: string,
  ): Promise<EmployeeLoginResponseDto> {
    const user: any = await this.getEmployeeLoginDetail(loginDto.username);

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

    const result = await this.generateJwtToken(user);

    // Add resourcePermissions to the response (not the JWT token)
    const resourcePermissions =
      await this.authorizationService.getEmployeePermissions(user.id);

    // Transform to response DTO to exclude sensitive data
    const userResponse = plainToInstance(EmployeeResponseDto, {
      ...result.user,
      resourcePermissions,
    });

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: userResponse,
    };
  }

  async me(token: EmployeeTokenClaim): Promise<EmployeeResponseDto> {
    const user = await this.getEmployeeLoginDetail(token.user.username);
    const userRoles = await this.authorizationService.getEmployeeRoles(
      token.user.sub,
    );
    const resourcePermissions =
      await this.authorizationService.getEmployeePermissions(token.user.sub);

    // Transform to response DTO to exclude sensitive data
    return plainToInstance(EmployeeResponseDto, {
      ...user,
      userRoles,
      resourcePermissions,
      server_time: new Date(),
    });
  }

  async refreshToken(payload: any): Promise<EmployeeLoginResponseDto> {
    const user = await this.getEmployeeLoginDetail(payload.username);
    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('error-messages.auth.invalid-token'),
      );
    }

    const result = await this.generateJwtToken(user);

    // Add resourcePermissions to the response (not the JWT token)
    const resourcePermissions =
      await this.authorizationService.getEmployeePermissions(user.id);

    // Transform to response DTO to exclude sensitive data
    const userResponse = plainToInstance(EmployeeResponseDto, {
      ...result.user,
      resourcePermissions,
    });

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: userResponse,
    };
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
        password: true, // Still needed for password verification
        email: true,
        require_password_change: true,
        is_active: true,
        is_suspended: true,
        username_verified: true,
      },
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
    // Minimal JWT payload following JWT BCP standards
    const jwtPayload = {
      sub: user.id || '',
      username: user.username || '',
      username_verified: user.username_verified || false,
      language: 'en',
      jti: `emp-${user.id}-${Date.now()}`, // Unique token identifier
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      algorithm: 'HS256',
      expiresIn: '1145m',
    });

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        username: user.username,
        jti: `refresh-emp-${user.id}-${Date.now()}`,
      },
      {
        algorithm: 'HS256',
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
