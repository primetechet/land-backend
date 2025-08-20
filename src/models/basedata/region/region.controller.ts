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
import { RegionService } from './region.service';
import { CreateRegionDto, UpdateRegionDto } from './dto';
import { DatabaseService } from 'src/common/database/database.service';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';

@ApiTags('region')
@ApiBearerAuth()
@Controller('region')
export class RegionController {
  constructor(
    private readonly regionService: RegionService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new region' })
  @ApiResponse({ status: 201, description: 'Region created successfully.' })
  @ApiResponse({ status: 422, description: 'Record already exists.' })
  async create(@Request() request, @Body() createRegionDto: CreateRegionDto) {
    const existingRegion = await this.prisma.region.findFirst({
      where: { name: createRegionDto.name },
    });

    if (existingRegion) {
      throw new HttpException(
        'Record already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    createRegionDto.created_by_id = request.user.sub;
    return this.regionService.create(createRegionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all regions' })
  @ApiResponse({ status: 200, description: 'List of regions.' })
  findAll(@Query() payload: any) {
    return this.regionService.findAll(payload);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated list of regions' })
  @ApiResponse({ status: 200, description: 'Paginated list of regions.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() payload: any) {
    return this.regionService.findAllPaginated(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a region by ID' })
  @ApiResponse({ status: 200, description: 'Region details.' })
  @ApiParam({ name: 'id', description: 'Region ID', type: String })
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a region by ID' })
  @ApiResponse({ status: 200, description: 'Region updated successfully.' })
  @ApiParam({ name: 'id', description: 'Region ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a region by ID' })
  @ApiResponse({ status: 200, description: 'Region deleted successfully.' })
  @ApiParam({ name: 'id', description: 'Region ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}
