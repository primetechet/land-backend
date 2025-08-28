import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { EmployeeAuthGuard } from 'src/common/guards/employee-auth.guard';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { EmployeeResponseDto } from './dto';

@ApiTags('Employee Management')
@Controller('employees')
@UseGuards(EmployeeAuthGuard)
@ApiBearerAuth()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({
    groups: ['me'],
  })
  @Resource([{ resource: RESOURCE.EMPLOYEE, actions: [ACTIONS.CREATE] }])
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully',
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Username, phone number, or email already exists',
  })
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Request() request: EmployeeTokenClaim,
  ): Promise<EmployeeResponseDto> {
    return this.employeeService.create(createEmployeeDto, request);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({
    groups: ['me'],
  })
  @Resource([{ resource: RESOURCE.EMPLOYEE, actions: [ACTIONS.READ] }])
  @ApiResponse({
    status: 200,
    description: 'Employees retrieved successfully',
    type: [EmployeeResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiQuery({
    name: 'branchId',
    required: false,
    description: 'Filter employees by branch ID (super admin only)',
  })
  findAll(
    @Request() request: EmployeeTokenClaim,
    @Query('branchId') branchId?: string,
  ): Promise<EmployeeResponseDto[]> {
    return this.employeeService.findAll(request, branchId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({
    groups: ['me'],
  })
  @Resource([{ resource: RESOURCE.EMPLOYEE, actions: [ACTIONS.READ_ONE] }])
  @ApiResponse({
    status: 200,
    description: 'Employee retrieved successfully',
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  findOne(
    @Param('id') id: string,
    @Request() request: EmployeeTokenClaim,
  ): Promise<EmployeeResponseDto> {
    return this.employeeService.findOne(id, request);
  }

  // @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // @SerializeOptions({
  //   groups: ['me'],
  // })
  // @Resource([{ resource: RESOURCE.EMPLOYEE, actions: [ACTIONS.UPDATE] }])
  // @ApiResponse({
  //   status: 200,
  //   description: 'Employee updated successfully',
  //   type: EmployeeResponseDto,
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: 'Forbidden - Insufficient permissions',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Employee not found',
  // })
  // @ApiResponse({
  //   status: 409,
  //   description: 'Conflict - Username, phone number, or email already exists',
  // })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateEmployeeDto: UpdateEmployeeDto,
  //   @Request() request: EmployeeTokenClaim,
  // ): Promise<EmployeeResponseDto> {
  //   return this.employeeService.update(id, updateEmployeeDto, request);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Resource([{ resource: RESOURCE.EMPLOYEE, actions: [ACTIONS.DELETE] }])
  // @ApiResponse({
  //   status: 204,
  //   description: 'Employee deleted successfully',
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: 'Forbidden - Insufficient permissions',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Employee not found',
  // })
  // remove(
  //   @Param('id') id: string,
  //   @Request() request: EmployeeTokenClaim,
  // ): Promise<void> {
  //   return this.employeeService.remove(id, request);
  // }
}
