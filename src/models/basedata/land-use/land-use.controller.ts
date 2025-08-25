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
import { LandUseService } from './land-use.service';
import { CreateLandUseDto, UpdateLandUseDto, SearchLandUseDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Land Uses')
@Controller('land-use')
export class LandUseController {
  constructor(private readonly landUseService: LandUseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new land use' })
  create(@Body() createDto: CreateLandUseDto) {
    return this.landUseService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all land uses' })
  findAll(@Query() query: SearchLandUseDto) {
    return this.landUseService.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated land uses' })
  findAllPaginated(@Query() query: SearchLandUseDto) {
    return this.landUseService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a land use by ID' })
  findOne(@Param('id') id: string) {
    return this.landUseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a land use by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateLandUseDto) {
    return this.landUseService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a land use by ID' })
  remove(@Param('id') id: string) {
    return this.landUseService.remove(id);
  }
}
