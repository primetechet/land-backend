import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthorizationModule } from 'src/common/services/authorization.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from 'src/common/services/refresh-token.service';

@Module({
  imports: [
    DatabaseModule,
    AuthorizationModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('AUTH_JWT_SECRET'),
          signOptions: {
            algorithm: 'HS256',
            expiresIn: '15m',
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
  controllers: [EmployeeController],
  providers: [EmployeeService, RefreshTokenService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
