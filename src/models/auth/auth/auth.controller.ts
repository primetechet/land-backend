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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';
import { LoginDto, LoginResponseDto, UserResponseDto } from './dto';
import { TokenClaim } from 'src/common/interfaces/login.interface';
import { NullableType } from 'src/common/types/nullable.type';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';

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
  login(@Body() loginDto: LoginDto, @Ip() ip): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, ip);
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
  public refresh(@Request() request: any): Promise<LoginResponseDto> {
    const payload = request.refreshTokenPayload;
    return this.authService.refreshToken(payload);
  }
}
