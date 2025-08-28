import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';

@ApiTags('employee')
@Controller('employee')
@ApiBearerAuth()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiBearerAuth()
  @Post()
  // @Resource([{ resource: RESOURCE.USER, actions: [ACTIONS.CREATE] }])
  async create(
    @Request() request: EmployeeTokenClaim,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeeService.create(createEmployeeDto, request);
  }

  @Get('paginated')
  // @Resource([{ resource: RESOURCE.USER, actions: [ACTIONS.READ] }])
  findAllPaginated(@Query() payload: any) {
    return this.employeeService.findAllPaginated(payload);
  }

  @Get(':id')
  @Resource([{ resource: RESOURCE.USER, actions: [ACTIONS.READ] }])
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'signature_file', maxCount: 1 },
      { name: 'photo_file', maxCount: 1 },
    ]),
  )
  @Resource([{ resource: RESOURCE.USER, actions: [ACTIONS.UPDATE] }])
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFiles() files: any,
    @Request() request: EmployeeTokenClaim,
  ) {
    updateEmployeeDto.updated_by_id = request.user.sub;
    return this.employeeService.update(id, updateEmployeeDto, files);
  }

  @Delete(':id')
  @Resource([{ resource: RESOURCE.USER, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
