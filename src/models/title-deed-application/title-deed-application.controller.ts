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
import { TitleDeedApplicationService } from './title-deed-application.service';
import {
  CreateTitleDeedApplicationDto,
  UpdateTitleDeedApplicationDto,
} from './dto';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { DatabaseService } from 'src/common/database/database.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { TokenClaim } from 'src/common/interfaces/login.interface';

@ApiTags('title-deed-application')
@ApiBearerAuth()
@Controller('title-deed-application')
export class TitleDeedApplicationController {
  constructor(
    private readonly service: TitleDeedApplicationService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new title deed application' })
  @ApiResponse({
    status: 201,
    description: 'Application created successfully.',
  })
  @ApiResponse({ status: 422, description: 'Duplicate application detected.' })
  async create(
    @Request() request: TokenClaim,
    @Body() dto: CreateTitleDeedApplicationDto,
  ) {
    return this.service.create(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'Get all title deed applications' })
  findAll(@Query() payload: any) {
    return this.service.findAll(payload);
  }

  @Get(':id/archive-document')
  archiveDocuments(@Param('id') id: string) {
    return this.service.archiveDocuments(id);
  }

  @Get(':id/client-document')
  clientDocuments(@Param('id') id: string) {
    return this.service.clientDocuments(id);
  }

  @Get(':id/plot')
  @ApiOperation({ summary: 'Get paginated title deed application plots' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  titleDeedPlot(
    @Param('id') id: string,
    @Query() payload: any,
    @Request() request,
  ) {
    return this.service.titleDeedPlot(id, payload);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated applications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() payload: any, @Request() request) {
    return this.service.findAllPaginated(payload);
  }

  @Get('my-applications')
  @ApiOperation({ summary: 'Get my applications where I am an approved owner' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findMyApplications(@Query() payload: any, @Request() request: TokenClaim) {
    return this.service.findMyApplications(request, payload);
  }

  @Get('by-owner/:idType/:idNumber')
  @ApiOperation({ summary: 'Get applications by owner ID number' })
  @ApiParam({
    name: 'idType',
    description: 'ID type (FAYDA_ID, GOVERNMENT_ID, TIN_NUMBER, PASSPORT)',
  })
  @ApiParam({ name: 'idNumber', description: 'ID number' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findApplicationsByOwnerId(
    @Param('idType') idType: string,
    @Param('idNumber') idNumber: string,
    @Query() payload: any,
  ) {
    return this.service.findApplicationsByOwnerId(idType, idNumber, payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a title deed application by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/submit')
  submit(@Request() request: TokenClaim, @Param('id') id: string) {
    return this.service.submit(id, request);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a title deed application by ID' })
  @ApiParam({ name: 'id', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(@Param('id') id: string, @Body() dto: UpdateTitleDeedApplicationDto) {
    return this.service.update(id, dto);
  }
}
