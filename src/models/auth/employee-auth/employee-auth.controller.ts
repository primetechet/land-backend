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
import {
  EmployeeLoginDto,
  EmployeeLoginResponseDto,
  EmployeeResponseDto,
} from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { NullableType } from 'src/common/types/nullable.type';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    description: 'Employee login successful',
    type: EmployeeLoginResponseDto,
  })
  adminLogin(
    @Body() loginDto: EmployeeLoginDto,
    @Ip() ip,
  ): Promise<EmployeeLoginResponseDto> {
    return this.employeeAuthService.login(loginDto, ip);
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
  public refresh(@Request() request: any): Promise<EmployeeLoginResponseDto> {
    const payload = request.refreshTokenPayload;
    return this.employeeAuthService.refreshToken(payload);
  }
}
