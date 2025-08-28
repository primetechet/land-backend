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
import { LoginDto } from './dto';
import { TokenClaim } from 'src/common/interfaces/login.interface';
import { NullableType } from 'src/common/types/nullable.type';
import { ApiBearerAuth } from '@nestjs/swagger';
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
  login(@Body() loginDto: LoginDto, @Ip() ip) {
    return this.authService.login(loginDto, ip);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  me(@Request() request: TokenClaim): Promise<NullableType<any>> {
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
  public refresh(@Request() request: any) {
    const payload = request.refreshTokenPayload;
    return this.authService.refreshToken(payload);
  }
}
