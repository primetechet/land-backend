import {
  Controller,
  Get,
  Post,
  Body,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Ip,
  Request,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { EmployeeAuthService } from './employee-auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';
import {
  EmployeeLoginDto,
  EmployeeResponseDto,
  EmployeeLoginResponseDto,
} from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { NullableType } from 'src/common/types/nullable.type';
import { ApiBearerAuth, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { EmployeeRefreshTokenGuard } from 'src/common/guards/employee-refresh-token.guard';
import { EmployeeAuthGuard } from 'src/common/guards/employee-auth.guard';

@Controller('employee-auth')
export class EmployeeAuthController {
  constructor(private readonly employeeAuthService: EmployeeAuthService) {}

  @Public()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Employee login successful',
    type: EmployeeLoginResponseDto,
  })
  @ApiHeader({
    name: 'user-agent',
    description: 'Browser/device user agent (optional)',
    required: false,
  })
  @ApiHeader({
    name: 'x-device-fingerprint',
    description: 'Device fingerprint for additional security (optional)',
    required: false,
  })
  adminLogin(
    @Body() loginDto: EmployeeLoginDto,
    @Ip() ip,
    @Headers('user-agent') userAgent?: string,
    @Headers('x-device-fingerprint') deviceFingerprint?: string,
  ): Promise<EmployeeLoginResponseDto> {
    return this.employeeAuthService.login(
      loginDto,
      ip,
      userAgent,
      deviceFingerprint,
    );
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({
    groups: ['me'],
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get current employee profile',
    type: EmployeeResponseDto,
  })
  me(@Request() request: EmployeeTokenClaim): Promise<EmployeeResponseDto> {
    return this.employeeAuthService.me(request);
  }

  @Public()
  @RefreshToken()
  @UseGuards(EmployeeRefreshTokenGuard)
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Employee token refreshed successfully',
    type: EmployeeLoginResponseDto,
  })
  @ApiHeader({
    name: 'user-agent',
    description: 'Browser/device user agent (optional)',
    required: false,
  })
  @ApiHeader({
    name: 'x-device-fingerprint',
    description: 'Device fingerprint for additional security (optional)',
    required: false,
  })
  public refresh(
    @Request() request: any,
    @Ip() ip,
    @Headers('user-agent') userAgent?: string,
    @Headers('x-device-fingerprint') deviceFingerprint?: string,
  ): Promise<EmployeeLoginResponseDto> {
    const payload = request.refreshTokenPayload;
    return this.employeeAuthService.refreshToken(
      payload,
      ip,
      userAgent,
      deviceFingerprint,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(EmployeeAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Employee logout successful',
  })
  public logout(@Request() request: any): Promise<void> {
    const employeeId = request.user?.sub;
    const jti = request.user?.jti;
    if (!employeeId) {
      throw new UnauthorizedException('Invalid token: Employee ID not found');
    }

    // Get the actual expiration time from the JWT payload
    const exp = request.user?.exp;
    const accessTokenExpiresAt = exp
      ? new Date(exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);

    return this.employeeAuthService.logout(
      employeeId,
      jti,
      'logout',
      jti,
      accessTokenExpiresAt,
    );
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(EmployeeAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Employee logout from all devices successful',
  })
  public logoutAll(@Request() request: EmployeeTokenClaim): Promise<void> {
    return this.employeeAuthService.logoutAll(request.user.sub);
  }
}
