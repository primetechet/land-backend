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
import { TitleDeedServiceService } from './title-deed-service.service';
import { CreateTitleDeedServiceDto, UpdateTitleDeedServiceDto } from './dto';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { DatabaseService } from 'src/common/database/database.service';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('title-deed-service')
@ApiBearerAuth()
@Controller('title-deed-service')
export class TitleDeedServiceController {
  constructor(
    private readonly service: TitleDeedServiceService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new title deed service' })
  @ApiResponse({ status: 201, description: 'Created successfully.' })
  @ApiResponse({ status: 422, description: 'Record already exists.' })
  async create(@Request() request, @Body() dto: CreateTitleDeedServiceDto) {
    const existing = await this.prisma.titleDeedService.findFirst({
      where: { name: dto.name },
    });

    if (existing) {
      throw new HttpException(
        'Record already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.service.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all title deed services' })
  findAll(@Query() payload: any) {
    return this.service.findAll(payload);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated title deed services' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() payload: any) {
    return this.service.findAllPaginated(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a title deed service by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a title deed service by ID' })
  @ApiParam({ name: 'id', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(@Param('id') id: string, @Body() dto: UpdateTitleDeedServiceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a title deed service by ID' })
  @ApiParam({ name: 'id', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
