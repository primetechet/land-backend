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
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto';
import { UpdateDistrictDto } from './dto';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { DatabaseService } from 'src/common/database/database.service';

@ApiTags('district')
@ApiBearerAuth()
@Controller('district')
export class DistrictController {
  constructor(
    private readonly districtService: DistrictService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new district' })
  @ApiResponse({ status: 201, description: 'District created successfully.' })
  @ApiResponse({ status: 422, description: 'Record already exists.' })
  async create(
    @Request() request,
    @Body() createDistrictDto: CreateDistrictDto,
  ) {
    const existingDistrict = await this.prisma.district.findFirst({
      where: { name: createDistrictDto.name },
    });

    if (existingDistrict) {
      throw new HttpException(
        'Record already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    createDistrictDto.created_by_id = request.user.sub;
    return this.districtService.create(createDistrictDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all districts' })
  @ApiResponse({ status: 200, description: 'List of districts.' })
  findAll(@Query() payload: any) {
    return this.districtService.findAll(payload);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated list of districts' })
  @ApiResponse({ status: 200, description: 'Paginated list of districts.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() payload: any) {
    return this.districtService.findAllPaginated(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a district by ID' })
  @ApiResponse({ status: 200, description: 'District details.' })
  @ApiParam({ name: 'id', description: 'District ID', type: String })
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a district by ID' })
  @ApiResponse({ status: 200, description: 'District updated successfully.' })
  @ApiParam({ name: 'id', description: 'District ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtService.update(id, updateDistrictDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a district by ID' })
  @ApiResponse({ status: 200, description: 'District deleted successfully.' })
  @ApiParam({ name: 'id', description: 'District ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.districtService.remove(id);
  }
}
