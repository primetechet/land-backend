import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TitleDeedServiceRequirementService } from './title-deed-service-requirement.service';
import {
  CreateTitleDeedServiceRequirementDto,
  UpdateTitleDeedServiceRequirementDto,
  SearchTitleDeedServiceRequirementDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Title Deed Service Requirements')
@Controller('title-deed-service-requirement')
export class TitleDeedServiceRequirementController {
  constructor(private readonly service: TitleDeedServiceRequirementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service requirement' })
  create(@Body() createDto: CreateTitleDeedServiceRequirementDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service requirements' })
  findAll(@Query() query: SearchTitleDeedServiceRequirementDto) {
    return this.service.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated service requirements' })
  findAllPaginated(@Query() query: SearchTitleDeedServiceRequirementDto) {
    return this.service.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service requirement by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service requirement by ID' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTitleDeedServiceRequirementDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service requirement by ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
