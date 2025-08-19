import { Module } from '@nestjs/common';
import { EmployeeAuthService } from './employee-auth.service';
import { EmployeeAuthController } from './employee-auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EmployeeAuthGuard } from 'src/common/guards/employee-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('AUTH_JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('AUTH_JWT_TOKEN_EXPIRES_IN'),
          },
        };
      },
    }),
  ],
  controllers: [EmployeeAuthController],
  providers: [
    EmployeeAuthService,
    {
      provide: APP_GUARD,
      useClass: EmployeeAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class EmployeeAuthModule {}
