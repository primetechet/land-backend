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
} from './dto';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { DatabaseService } from 'src/common/database/database.service';

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
  @ApiResponse({ status: 422, description: 'Duplicate record found.' })
  async create(
    @Request() request,
    @Body() dto: CreateTitleDeedApplicationOwnerDto,
  ) {
    const existing = await this.prisma.titleDeedApplicationOwner.findFirst({
      where: {
        id_number: dto.id_number,
        title_deed_application_id: dto.title_deed_application_id,
      },
    });

    if (existing) {
      throw new HttpException(
        'Owner already exists for this application',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

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

  @Patch(':id')
  @ApiOperation({ summary: 'Update a title deed application owner by ID' })
  @ApiParam({ name: 'id', type: String })
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
}
