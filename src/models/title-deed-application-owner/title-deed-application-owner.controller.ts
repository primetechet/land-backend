import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TitleDeedApplicationOwnerService } from './title-deed-application-owner.service';
import {
  CreateTitleDeedApplicationOwnerDto,
  UpdateTitleDeedApplicationOwnerDto,
  VerifyTitleDeedApplicationOwnerDto,
  RejectTitleDeedApplicationOwnerDto,
} from './dto';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { DatabaseService } from 'src/common/database/database.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@ApiTags('title-deed-application-owner')
@ApiBearerAuth()
@Controller('title-deed-application-owner')
export class TitleDeedApplicationOwnerController {
  constructor(
    private readonly service: TitleDeedApplicationOwnerService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new title deed application owner' })
  @ApiResponse({ status: 201, description: 'Owner created successfully.' })
  @ApiResponse({ status: 422, description: 'Duplicate verified owner found.' })
  async create(
    @Request() request,
    @Body() dto: CreateTitleDeedApplicationOwnerDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all title deed application owners' })
  findAll(@Query() payload: any) {
    return this.service.findAll(payload);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated title deed application owners' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() payload: any) {
    return this.service.findAllPaginated(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a title deed application owner by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('application/:applicationId/verified')
  @ApiOperation({
    summary: 'Get the verified owner for a title deed application',
  })
  @ApiParam({ name: 'applicationId', type: String })
  findVerifiedOwnerByApplicationId(
    @Param('applicationId') applicationId: string,
  ) {
    return this.service.findVerifiedOwnerByApplicationId(applicationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a title deed application owner by ID' })
  @ApiParam({ name: 'id', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTitleDeedApplicationOwnerDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a title deed application owner by ID' })
  @ApiParam({ name: 'id', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify a title deed application owner' })
  @ApiParam({ name: 'id', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  async verify(
    @Param('id') id: string,
    @Body() dto: VerifyTitleDeedApplicationOwnerDto,
    @Request() request: EmployeeTokenClaim,
  ) {
    return this.service.verify(id, dto, request);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a title deed application owner' })
  @ApiParam({ name: 'id', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectTitleDeedApplicationOwnerDto,
    @Request() request: EmployeeTokenClaim,
  ) {
    return this.service.reject(id, dto, request);
  }
}
