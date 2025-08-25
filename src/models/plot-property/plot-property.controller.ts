import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Request,
} from '@nestjs/common';
import { PlotPropertyService } from './plot-property.service';
import {
  CreatePlotPropertyDto,
  UpdatePlotPropertyDto,
  SearchPlotPropertyDto,
  ApprovePlotPropertyDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Plot Properties')
@Controller('plot-property')
export class PlotPropertyController {
  constructor(private readonly service: PlotPropertyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plot property' })
  create(@Body() dto: CreatePlotPropertyDto, @Request() request) {
    return this.service.create(dto, request);
  }

  @Get()
  @ApiOperation({ summary: 'Get all plot properties' })
  findAll(@Query() query: SearchPlotPropertyDto) {
    return this.service.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated plot properties' })
  findAllPaginated(@Query() query: SearchPlotPropertyDto) {
    return this.service.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plot property by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plot property' })
  update(@Param('id') id: string, @Body() dto: UpdatePlotPropertyDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve or reject a plot property' })
  approve(@Param('id') id: string, @Body() dto: ApprovePlotPropertyDto) {
    return this.service.approve(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a plot property' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
