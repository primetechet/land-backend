import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto';
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

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async login(loginDto: LoginDto, ip_address: string) {
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

    return this.generateJwtToken(user);
  }

  async me(token: TokenClaim) {
    const user = await this.getLoginDetail(token.user.username);

    return { ...user, server_time: new Date() };
  }

  async refreshToken(token: TokenClaim) {
    if (!token.user.username) {
      throw new UnauthorizedException(
        this.i18n.t('error-messages.auth.invalid-token'),
      );
    }
    const user = await this.getLoginDetail(token.user.username);
    if (user) return this.generateJwtToken(user);
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
        password: true,
        email: true,
        require_password_change: true,
        is_active: true,
        is_suspended: true,
      },
    });
  }

  private async generateJwtToken<T extends ILogin | Partial<ILogin>>(
    user: T,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: T;
  }> {
    const jwtPayload: {
      sub: string;
      username: string;
      roles?: IUserRole[];
      username_verified: boolean;
      language: string;
    } = {
      sub: user.id || '',
      username: user.username || '',
      username_verified: user.username_verified || false,
      language: 'en',
    };

    if ('userRoles' in user && user.userRoles) {
      jwtPayload.roles = user.userRoles;
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
