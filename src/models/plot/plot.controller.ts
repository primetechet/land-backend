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
import {
  CreatePlotDto,
  UpdatePlotDto,
  SearchPlotDto,
  ClientRejectPlotDto,
  ClientConfirmationPlotDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { PaginationDto } from 'src/common/dtos/global.dto';

@ApiTags('Plots')
@Controller('plot')
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

  @Get(':id/property')
  @ApiOperation({ summary: 'Get paginated plot properties' })
  plotProperty(@Param('id') id: string, @Query() query: PaginationDto) {
    return this.plotService.plotProperty(id, query);
  }

  @Get(':id/certificate')
  @ApiOperation({ summary: 'Get paginated plot certificate data' })
  plotCertificate(@Param('id') id: string) {
    return this.plotService.plotCertificate(id);
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

  @Post(':id/submit')
  submit(@Request() request: EmployeeTokenClaim, @Param('id') id: string) {
    return this.plotService.submit(id, request);
  }

  @Post(':id/agree')
  // @Resource([
  //   {
  //     resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
  //     actions: [ACTIONS.REJECT],
  //   },
  // ])
  agree(
    @Request() request,
    @Param('id') id: string,
    @Body()
    clientConfirmationDto: ClientConfirmationPlotDto,
  ) {
    return this.plotService.clientConfirmed(id, clientConfirmationDto);
  }

  @Post(':id/disagree')
  // @Resource([
  //   {
  //     resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
  //     actions: [ACTIONS.REJECT],
  //   },
  // ])
  disagree(
    @Request() request,
    @Param('id') id: string,
    @Body()
    clientConfirmationDto: ClientRejectPlotDto,
  ) {
    return this.plotService.clientReject(id, clientConfirmationDto);
  }
}
