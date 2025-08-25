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
import { LoginDto } from './dto';
import { TokenClaim } from 'src/common/interfaces/login.interface';
import { NullableType } from 'src/common/types/nullable.type';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  me(@Request() request: TokenClaim): Promise<NullableType<any>> {
    return this.authService.me(request);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public refresh(@Request() request: TokenClaim) {
    return this.authService.refreshToken(request);
  }
}
