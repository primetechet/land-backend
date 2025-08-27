import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { TokenClaim } from '../interfaces/login.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.warn('No token provided in request');
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('AUTH_JWT_SECRET'),
        algorithms: ['HS256'], // Pin to HS256 only
        issuer: this.configService.get('JWT_ISSUER', 'land-backend'),
        audience: this.configService.get('JWT_AUDIENCE', 'land-backend-users'),
        clockTolerance: 30, // 30 seconds tolerance for clock skew
      });

      // Validate required claims
      this.validateRequiredClaims(payload);

      // Create minimal token claim structure
      const tokenClaim: TokenClaim['user'] = {
        sub: payload.sub,
        username: payload.username,
        username_verified: payload.username_verified || false,
        language: payload.language || 'en',
      };

      request['user'] = tokenClaim;
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`, {
        error: error.name,
        token: token.substring(0, 20) + '...',
      });
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private validateRequiredClaims(payload: any): void {
    const requiredClaims = ['sub', 'iss', 'aud', 'exp', 'iat'];
    const missingClaims = requiredClaims.filter((claim) => !payload[claim]);

    if (missingClaims.length > 0) {
      this.logger.warn(
        `Missing required JWT claims: ${missingClaims.join(', ')}`,
      );
      throw new UnauthorizedException('Invalid token claims');
    }

    // Validate exp claim
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      this.logger.warn('Token has expired');
      throw new UnauthorizedException('Token expired');
    }

    // Validate nbf claim if present
    if (payload.nbf && payload.nbf > now) {
      this.logger.warn('Token not yet valid');
      throw new UnauthorizedException('Token not yet valid');
    }

    // Validate iat claim
    if (payload.iat && payload.iat > now) {
      this.logger.warn('Token issued in the future');
      throw new UnauthorizedException('Invalid token issue time');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
