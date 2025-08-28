import { Module } from '@nestjs/common';
import { EmployeeAuthService } from './employee-auth.service';
import { EmployeeAuthController } from './employee-auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EmployeeAuthGuard } from 'src/common/guards/employee-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RefreshTokenService } from 'src/common/services/refresh-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('AUTH_JWT_SECRET'),
          signOptions: {
            algorithm: 'HS256',
            expiresIn: '15m', // Short-lived access tokens
            issuer: configService.get<string>('JWT_ISSUER', 'land-backend'),
            audience: configService.get<string>(
              'JWT_AUDIENCE',
              'land-backend-users',
            ),
          },
          verifyOptions: {
            algorithms: ['HS256'],
            issuer: configService.get<string>('JWT_ISSUER', 'land-backend'),
            audience: configService.get<string>(
              'JWT_AUDIENCE',
              'land-backend-users',
            ),
            clockTolerance: 30,
          },
        };
      },
    }),
  ],
  controllers: [EmployeeAuthController],
  providers: [
    EmployeeAuthService,
    RefreshTokenService,
    {
      provide: APP_GUARD,
      useClass: EmployeeAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [EmployeeAuthService, RefreshTokenService],
})
export class EmployeeAuthModule {}
