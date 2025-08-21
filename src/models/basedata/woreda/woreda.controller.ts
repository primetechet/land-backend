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
import { WoredaService } from './woreda.service';
import { CreateWoredaDto, UpdateWoredaDto } from './dto';
import { DatabaseService } from 'src/common/database/database.service';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';

@ApiTags('woreda')
@ApiBearerAuth()
@Controller('woreda')
export class WoredaController {
  constructor(
    private readonly woredaService: WoredaService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new woreda' })
  @ApiResponse({ status: 201, description: 'Woreda created successfully.' })
  @ApiResponse({ status: 422, description: 'Record already exists.' })
  async create(@Request() request, @Body() createWoredaDto: CreateWoredaDto) {
    const existing = await this.prisma.woreda.findFirst({
      where: {
        OR: [
          {
            name: createWoredaDto.name,
            district_id: createWoredaDto.district_id,
          },
          {
            zip_code: createWoredaDto.zip_code,
            district_id: createWoredaDto.district_id,
          },
        ],
      },
    });

    if (existing) {
      throw new HttpException(
        'Record already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.woredaService.create(createWoredaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all woredas' })
  @ApiResponse({ status: 200, description: 'List of woredas.' })
  findAll(@Query() payload: any) {
    return this.woredaService.findAll(payload);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated list of woredas' })
  @ApiResponse({ status: 200, description: 'Paginated list of woredas.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() payload: any) {
    return this.woredaService.findAllPaginated(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a woreda by ID' })
  @ApiResponse({ status: 200, description: 'Woreda details.' })
  @ApiParam({ name: 'id', description: 'Woreda ID', type: String })
  findOne(@Param('id') id: string) {
    return this.woredaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a woreda by ID' })
  @ApiResponse({ status: 200, description: 'Woreda updated successfully.' })
  @ApiParam({ name: 'id', description: 'Woreda ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(@Param('id') id: string, @Body() updateWoredaDto: UpdateWoredaDto) {
    return this.woredaService.update(id, updateWoredaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a woreda by ID' })
  @ApiResponse({ status: 200, description: 'Woreda deleted successfully.' })
  @ApiParam({ name: 'id', description: 'Woreda ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.woredaService.remove(id);
  }
}
