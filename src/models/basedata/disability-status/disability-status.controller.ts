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
import { DisabilityStatusService } from './disability-status.service';
import { CreateDisabilityStatusDto, UpdateDisabilityStatusDto } from './dto';
import { DatabaseService } from 'src/common/database/database.service';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';

@ApiTags('disability-status')
@ApiBearerAuth()
@Controller('disability-status')
export class DisabilityStatusController {
  constructor(
    private readonly disabilityStatusService: DisabilityStatusService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new disability status' })
  @ApiResponse({
    status: 201,
    description: 'Disability status created successfully.',
  })
  @ApiResponse({ status: 422, description: 'Record already exists.' })
  async create(
    @Request() request,
    @Body() createDisabilityStatusDto: CreateDisabilityStatusDto,
  ) {
    const existing = await this.prisma.disabilityStatus.findFirst({
      where: { name: createDisabilityStatusDto.name },
    });

    if (existing) {
      throw new HttpException(
        'Record already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    createDisabilityStatusDto.created_by_id = request.user.sub;
    return this.disabilityStatusService.create(createDisabilityStatusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all disability statuses' })
  @ApiResponse({ status: 200, description: 'List of disability statuses.' })
  findAll(@Query() payload: any) {
    return this.disabilityStatusService.findAll(payload);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated list of disability statuses' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of disability statuses.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() payload: any) {
    return this.disabilityStatusService.findAllPaginated(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a disability status by ID' })
  @ApiResponse({ status: 200, description: 'Disability status details.' })
  @ApiParam({ name: 'id', description: 'Disability status ID', type: String })
  findOne(@Param('id') id: string) {
    return this.disabilityStatusService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a disability status by ID' })
  @ApiResponse({
    status: 200,
    description: 'Disability status updated successfully.',
  })
  @ApiParam({ name: 'id', description: 'Disability status ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(
    @Param('id') id: string,
    @Body() updateDisabilityStatusDto: UpdateDisabilityStatusDto,
  ) {
    return this.disabilityStatusService.update(id, updateDisabilityStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a disability status by ID' })
  @ApiResponse({
    status: 200,
    description: 'Disability status deleted successfully.',
  })
  @ApiParam({ name: 'id', description: 'Disability status ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.disabilityStatusService.remove(id);
  }
}
