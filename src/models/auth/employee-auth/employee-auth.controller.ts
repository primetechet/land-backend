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
import { EmployeeLoginDto } from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { NullableType } from 'src/common/types/nullable.type';

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
  me(@Request() request: EmployeeTokenClaim): Promise<NullableType<any>> {
    return this.employeeAuthService.me(request);
  }
}
