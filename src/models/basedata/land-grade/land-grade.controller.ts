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
import { LandGradeService } from './land-grade.service';
import {
  CreateLandGradeDto,
  UpdateLandGradeDto,
  SearchLandGradeDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Land Grades')
@Controller('land-grades')
export class LandGradeController {
  constructor(private readonly landGradeService: LandGradeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new land grade' })
  create(@Body() createDto: CreateLandGradeDto) {
    return this.landGradeService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all land grades' })
  findAll(@Query() query: SearchLandGradeDto) {
    return this.landGradeService.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated land grades' })
  findAllPaginated(@Query() query: SearchLandGradeDto) {
    return this.landGradeService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a land grade by ID' })
  findOne(@Param('id') id: string) {
    return this.landGradeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a land grade by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateLandGradeDto) {
    return this.landGradeService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a land grade by ID' })
  remove(@Param('id') id: string) {
    return this.landGradeService.remove(id);
  }
}
