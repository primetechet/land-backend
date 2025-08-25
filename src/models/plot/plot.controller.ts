import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { PlotService } from './plot.service';
import { CreatePlotDto, UpdatePlotDto, SearchPlotDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@ApiTags('Plots')
@Controller('plots')
export class PlotController {
  constructor(private readonly plotService: PlotService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plot' })
  create(
    @Body() createDto: CreatePlotDto,
    @Request() request: EmployeeTokenClaim,
  ) {
    return this.plotService.create(createDto, request);
  }

  @Get()
  @ApiOperation({ summary: 'Get all plots with filters' })
  findAll(@Query() query: SearchPlotDto) {
    return this.plotService.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated plots with filters' })
  findAllPaginated(@Query() query: SearchPlotDto) {
    return this.plotService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plot by ID' })
  findOne(@Param('id') id: string) {
    return this.plotService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plot by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePlotDto) {
    return this.plotService.update(id, updateDto);
  }
}
