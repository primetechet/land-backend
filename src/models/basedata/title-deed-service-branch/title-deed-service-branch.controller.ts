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
import { TitleDeedServiceBranchService } from './title-deed-service-branch.service';
import {
  CreateTitleDeedServiceBranchDto,
  UpdateTitleDeedServiceBranchDto,
  SearchTitleDeedServiceBranchDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Title Deed Service Branches')
@Controller('title-deed-service-branch')
export class TitleDeedServiceBranchController {
  constructor(private readonly service: TitleDeedServiceBranchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new title deed service branch' })
  create(@Body() createDto: CreateTitleDeedServiceBranchDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all title deed service branches' })
  findAll(@Query() query: SearchTitleDeedServiceBranchDto) {
    return this.service.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated title deed service branches' })
  findAllPaginated(@Query() query: SearchTitleDeedServiceBranchDto) {
    return this.service.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service branch by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service branch by ID' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTitleDeedServiceBranchDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service branch by ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
