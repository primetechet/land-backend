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
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';
import { LoginDto, LoginResponseDto, UserResponseDto } from './dto';
import { TokenClaim } from 'src/common/interfaces/login.interface';
import { NullableType } from 'src/common/types/nullable.type';
import { ApiBearerAuth, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
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
  login(
    @Body() loginDto: LoginDto,
    @Ip() ip,
    @Headers('user-agent') userAgent?: string,
    @Headers('x-device-fingerprint') deviceFingerprint?: string,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, ip, userAgent, deviceFingerprint);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @ApiResponse({
    status: 200,
    description: 'Get current user profile',
    type: UserResponseDto,
  })
  me(@Request() request: TokenClaim): Promise<UserResponseDto> {
    return this.authService.me(request);
  }

  @Public()
  @RefreshToken()
  @UseGuards(RefreshTokenGuard)
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: LoginResponseDto,
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
  ): Promise<LoginResponseDto> {
    const payload = request.refreshTokenPayload;
    return this.authService.refreshToken(
      payload,
      ip,
      userAgent,
      deviceFingerprint,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  public logout(@Request() request: any): Promise<void> {
    const userId = request.user?.sub;
    const jti = request.user?.jti;
    if (!userId) {
      throw new UnauthorizedException('Invalid token: User ID not found');
    }

    // Get the actual expiration time from the JWT payload
    const exp = request.user?.exp;
    const accessTokenExpiresAt = exp
      ? new Date(exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);

    return this.authService.logout(
      userId,
      jti,
      'logout',
      jti,
      accessTokenExpiresAt,
    );
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Logout from all devices successful',
  })
  public logoutAll(@Request() request: TokenClaim): Promise<void> {
    return this.authService.logoutAll(request.user.sub);
  }
}
