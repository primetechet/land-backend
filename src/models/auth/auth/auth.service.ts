import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, UserResponseDto, LoginResponseDto } from './dto';
import { DatabaseService } from 'src/common/database/database.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  TokenClaim,
  ILogin,
  IUserRole,
} from 'src/common/interfaces/login.interface';
import { AuthorizationService } from 'src/common/services/authorization.service';
import { RefreshTokenService } from 'src/common/services/refresh-token.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly authorizationService: AuthorizationService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async login(
    loginDto: LoginDto,
    ip_address: string,
    userAgent?: string,
    deviceFingerprint?: string,
  ): Promise<LoginResponseDto> {
    const user = await this.getLoginDetail(loginDto.username);

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
      await this.prisma.loginHistory.create({
        data: {
          user_id: user.id,
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

    // Add userRoles to the response (not the JWT token)
    const userRoles = await this.authorizationService.getUserRoles(user.id);

    // Transform to response DTO to exclude sensitive data
    const userResponse = plainToInstance(UserResponseDto, {
      ...result.user,
      userRoles,
    });

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: userResponse,
    };
  }

  async me(token: TokenClaim): Promise<UserResponseDto> {
    const user = await this.getLoginDetail(token.user.username);
    const userRoles = await this.authorizationService.getUserRoles(
      token.user.sub,
    );

    // Transform to response DTO to exclude sensitive data
    return plainToInstance(UserResponseDto, {
      ...user,
      userRoles,
      server_time: new Date(),
    });
  }

  async refreshToken(
    payload: any,
    ip_address?: string,
    userAgent?: string,
    deviceFingerprint?: string,
  ): Promise<LoginResponseDto> {
    // Use subject_user_id for lookup instead of username
    const user = await this.getLoginDetailById(payload.sub);
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

    // Add userRoles to the response (not the JWT token)
    const userRoles = await this.authorizationService.getUserRoles(user.id);

    // Transform to response DTO to exclude sensitive data
    const userResponse = plainToInstance(UserResponseDto, {
      ...user,
      userRoles,
    });

    return {
      accessToken: rotationResult.newAccessToken,
      refreshToken: rotationResult.newRefreshToken,
      user: userResponse,
    };
  }

  async logout(
    userId: string,
    jti?: string,
    reason: string = 'logout',
    accessTokenJti?: string,
    accessTokenExpiresAt?: Date,
  ): Promise<void> {
    if (jti && accessTokenJti && accessTokenExpiresAt) {
      // Use the new method that finds and revokes the active refresh token
      await this.refreshTokenService.revokeCurrentUserSession(
        userId,
        'user',
        accessTokenJti,
        accessTokenExpiresAt,
        reason,
      );
    } else {
      // Fallback: revoke all tokens for the user
      await this.refreshTokenService.revokeAllUserTokens(
        userId,
        'user',
        reason,
      );
    }
  }

  async logoutAll(
    userId: string,
    reason: string = 'logout_all',
  ): Promise<void> {
    await this.refreshTokenService.revokeAllUserTokens(userId, 'user', reason);
  }

  async getLoginDetail(username: string) {
    return await this.prisma.user.findUnique({
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

  async getLoginDetailById(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
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

  private async generateJwtToken<T extends ILogin | Partial<ILogin>>(
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
    const accessTokenJti = `${user.id}-${Date.now()}`;
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
      'user',
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
