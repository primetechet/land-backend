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
import { RefreshTokenService } from 'src/common/services/refresh-token.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EmployeeAuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly authorizationService: AuthorizationService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async login(
    loginDto: EmployeeLoginDto,
    ip_address: string,
    userAgent?: string,
    deviceFingerprint?: string,
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

    const result = await this.generateJwtToken(
      user,
      ip_address,
      userAgent,
      deviceFingerprint,
    );

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

  async refreshToken(
    payload: any,
    ip_address?: string,
    userAgent?: string,
    deviceFingerprint?: string,
  ): Promise<EmployeeLoginResponseDto> {
    // Use subject_user_id for lookup instead of username
    const user = await this.getEmployeeLoginDetailById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('error-messages.auth.invalid-token'),
      );
    }

    // Use the refresh token service to rotate tokens
    const rotationResult = await this.refreshTokenService.rotateRefreshToken(
      payload.jti,
      ip_address,
      userAgent,
      deviceFingerprint,
    );

    // Add resourcePermissions to the response (not the JWT token)
    const resourcePermissions =
      await this.authorizationService.getEmployeePermissions(user.id);

    // Transform to response DTO to exclude sensitive data
    const userResponse = plainToInstance(EmployeeResponseDto, {
      ...user,
      resourcePermissions,
    });

    return {
      accessToken: rotationResult.newAccessToken,
      refreshToken: rotationResult.newRefreshToken,
      user: userResponse,
    };
  }

  async logout(
    employeeId: string,
    jti?: string,
    reason: string = 'logout',
    accessTokenJti?: string,
    accessTokenExpiresAt?: Date,
  ): Promise<void> {
    if (jti && accessTokenJti && accessTokenExpiresAt) {
      // Use the new method that finds and revokes the active refresh token
      await this.refreshTokenService.revokeCurrentUserSession(
        employeeId,
        'employee',
        accessTokenJti,
        accessTokenExpiresAt,
        reason,
      );
    } else {
      // Fallback: revoke all tokens for the employee
      await this.refreshTokenService.revokeAllUserTokens(
        employeeId,
        'employee',
        reason,
      );
    }
  }

  async logoutAll(
    employeeId: string,
    reason: string = 'logout_all',
  ): Promise<void> {
    await this.refreshTokenService.revokeAllUserTokens(
      employeeId,
      'employee',
      reason,
    );
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

  async getEmployeeLoginDetailById(employeeId: string) {
    return await this.prisma.employee.findUnique({
      where: {
        id: employeeId,
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
    ip_address?: string,
    userAgent?: string,
    deviceFingerprint?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: T;
  }> {
    // Generate a new access token with short expiration
    const accessTokenJti = `emp-${user.id}-${Date.now()}`;
    const accessToken = this.jwtService.sign(
      {
        sub: user.id || '',
        username: user.username || '',
        username_verified: user.username_verified || false,
        language: 'en',
        jti: accessTokenJti,
        type: 'access',
      },
      {
        algorithm: 'HS256',
        expiresIn: '15m', // Short-lived access tokens
        issuer: 'land-backend',
        audience: 'land-backend-users',
      },
    );

    // Create a stateful refresh token
    const { refreshToken } = await this.refreshTokenService.createRefreshToken(
      user.id || '',
      'employee',
      user.username || '', // Pass username for lookup
      ip_address,
      userAgent,
      deviceFingerprint,
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
