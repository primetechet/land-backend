import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Ip,
  Request,
} from '@nestjs/common';
import { EmployeeAuthService } from './employee-auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';
import { EmployeeLoginDto } from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { NullableType } from 'src/common/types/nullable.type';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { EmployeeRefreshTokenGuard } from 'src/common/guards/employee-refresh-token.guard';

@Controller('employee-auth')
export class EmployeeAuthController {
  constructor(private readonly employeeAuthService: EmployeeAuthService) {}

  @Public()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() loginDto: EmployeeLoginDto, @Ip() ip) {
    return this.employeeAuthService.login(loginDto, ip);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({
    groups: ['me'],
  })
  @ApiBearerAuth()
  me(@Request() request: EmployeeTokenClaim): Promise<NullableType<any>> {
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
  public refresh(@Request() request: any) {
    const payload = request.refreshTokenPayload;
    return this.employeeAuthService.refreshToken(payload);
  }
}
