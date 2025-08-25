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
import { PropertyTypeService } from './property-type.service';
import {
  CreatePropertyTypeDto,
  UpdatePropertyTypeDto,
  SearchPropertyTypeDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Property Types')
@Controller('property-type')
export class PropertyTypeController {
  constructor(private readonly propertyTypeService: PropertyTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property type' })
  create(@Body() createDto: CreatePropertyTypeDto) {
    return this.propertyTypeService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all property types' })
  findAll(@Query() query: SearchPropertyTypeDto) {
    return this.propertyTypeService.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated property types' })
  findAllPaginated(@Query() query: SearchPropertyTypeDto) {
    return this.propertyTypeService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property type by ID' })
  findOne(@Param('id') id: string) {
    return this.propertyTypeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a property type by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePropertyTypeDto) {
    return this.propertyTypeService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a property type by ID' })
  remove(@Param('id') id: string) {
    return this.propertyTypeService.remove(id);
  }
}
