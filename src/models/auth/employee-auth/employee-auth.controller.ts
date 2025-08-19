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
} from '@nestjs/common';
import { EmployeeAuthService } from './employee-auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { EmployeeLoginDto } from './dto';

@Controller('employee-auth')
export class EmployeeAuthController {
  constructor(private readonly employeeAuthService: EmployeeAuthService) {}

  @Public()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() loginDto: EmployeeLoginDto, @Ip() ip) {
    return this.employeeAuthService.login(loginDto, ip);
  }
}
