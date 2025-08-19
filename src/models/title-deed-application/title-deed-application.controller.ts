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
  async create(@Request() request, @Body() dto: CreateTitleDeedApplicationDto) {
    const existing = await this.prisma.titleDeedApplication.findFirst({
      where: { title_deed_number: dto.title_deed_number },
    });

    if (existing) {
      throw new HttpException(
        'Application already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    dto.created_by_id = request.user.sub;
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all title deed applications' })
  findAll(@Query() payload: any) {
    return this.service.findAll(payload);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated applications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() payload: any) {
    return this.service.findAllPaginated(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a title deed application by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a title deed application by ID' })
  @ApiParam({ name: 'id', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(@Param('id') id: string, @Body() dto: UpdateTitleDeedApplicationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a title deed application by ID' })
  @ApiParam({ name: 'id', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
