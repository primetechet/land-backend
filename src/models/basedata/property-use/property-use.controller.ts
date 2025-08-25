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
import { PropertyUseService } from './property-use.service';
import {
  CreatePropertyUseDto,
  UpdatePropertyUseDto,
  SearchPropertyUseDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Property Uses')
@Controller('property-uses')
export class PropertyUseController {
  constructor(private readonly propertyUseService: PropertyUseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property use' })
  create(@Body() createDto: CreatePropertyUseDto) {
    return this.propertyUseService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all property uses' })
  findAll(@Query() query: SearchPropertyUseDto) {
    return this.propertyUseService.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated property uses' })
  findAllPaginated(@Query() query: SearchPropertyUseDto) {
    return this.propertyUseService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property use by ID' })
  findOne(@Param('id') id: string) {
    return this.propertyUseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a property use by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePropertyUseDto) {
    return this.propertyUseService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a property use by ID' })
  remove(@Param('id') id: string) {
    return this.propertyUseService.remove(id);
  }
}
