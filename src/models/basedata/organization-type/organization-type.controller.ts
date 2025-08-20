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
import { OrganizationTypeService } from './organization-type.service';
import { CreateOrganizationTypeDto, UpdateOrganizationTypeDto } from './dto';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { DatabaseService } from 'src/common/database/database.service';

@ApiTags('organization-type')
@ApiBearerAuth()
@Controller('organization-type')
export class OrganizationTypeController {
  constructor(
    private readonly service: OrganizationTypeService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization type' })
  @ApiResponse({ status: 201, description: 'Organization type created.' })
  @ApiResponse({ status: 422, description: 'Record already exists.' })
  async create(
    @Request() request,
    @Body() createDto: CreateOrganizationTypeDto,
  ) {
    const existing = await this.prisma.organizationType.findFirst({
      where: { name: createDto.name },
    });

    if (existing) {
      throw new HttpException(
        'Record already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    createDto.created_by_id = request.user.sub;
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organization types' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated organization types' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() query: any) {
    return this.service.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization type by ID' })
  @ApiParam({ name: 'id', description: 'OrganizationType ID', type: String })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization type' })
  @ApiParam({ name: 'id', description: 'OrganizationType ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrganizationTypeDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization type' })
  @ApiParam({ name: 'id', description: 'OrganizationType ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
