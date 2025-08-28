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
import { REFRESH_TOKEN_KEY } from 'src/common/decorators/refresh-token.decorator';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  private readonly logger = new Logger(RefreshTokenGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isRefreshToken = this.reflector.getAllAndOverride<boolean>(
      REFRESH_TOKEN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isRefreshToken) {
      return true; // Let other guards handle this
    }

    // For refresh token endpoints, we handle all validation ourselves
    // This prevents conflicts with the global AuthGuard

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.warn('No refresh token provided in request');
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('AUTH_JWT_SECRET'),
        algorithms: ['HS256'], // Pin to HS256 only
        issuer: this.configService.get('JWT_ISSUER', 'land-backend'),
        // Don't validate audience for refresh tokens to avoid conflicts
        // We'll validate the JTI pattern instead
        clockTolerance: 30, // 30 seconds tolerance for clock skew
      });

      // Validate required claims
      this.validateRequiredClaims(payload);

      // Validate that this is actually a refresh token
      this.validateRefreshToken(payload);

      // Add the validated payload to the request
      request['refreshTokenPayload'] = payload;
    } catch (error) {
      this.logger.warn(`Refresh token validation failed: ${error.message}`, {
        error: error.name,
        token: token.substring(0, 20) + '...',
      });
      throw new UnauthorizedException('Invalid refresh token');
    }
    return true;
  }

  private validateRequiredClaims(payload: any): void {
    const requiredClaims = ['sub', 'iss', 'exp', 'iat', 'jti']; // Remove 'aud' for refresh tokens
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
      this.logger.warn('Refresh token has expired');
      throw new UnauthorizedException('Refresh token expired');
    }

    // Validate nbf claim if present
    if (payload.nbf && payload.nbf > now) {
      this.logger.warn('Refresh token not yet valid');
      throw new UnauthorizedException('Refresh token not yet valid');
    }

    // Validate iat claim
    if (payload.iat && payload.iat > now) {
      this.logger.warn('Refresh token issued in the future');
      throw new UnauthorizedException('Invalid refresh token issue time');
    }
  }

  private validateRefreshToken(payload: any): void {
    // Check if it's a refresh token by examining the JTI
    if (!payload.jti || !payload.jti.startsWith('refresh-')) {
      this.logger.warn('Token is not a refresh token (invalid JTI)');
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Additional refresh token specific validations can be added here
    // For example, checking if the token has been revoked, etc.
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
