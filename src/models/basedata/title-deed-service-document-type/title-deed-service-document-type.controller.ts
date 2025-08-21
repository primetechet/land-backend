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
import { TitleDeedServiceDocumentTypeService } from './title-deed-service-document-type.service';
import {
  CreateTitleDeedServiceDocumentTypeDto,
  UpdateTitleDeedServiceDocumentTypeDto,
  SearchTitleDeedServiceDocumentTypeDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Title Deed Service Document Types')
@Controller('title-deed-service-document-type')
export class TitleDeedServiceDocumentTypeController {
  constructor(private readonly service: TitleDeedServiceDocumentTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service document type' })
  create(@Body() createDto: CreateTitleDeedServiceDocumentTypeDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service document types' })
  findAll(@Query() query: SearchTitleDeedServiceDocumentTypeDto) {
    return this.service.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated service document types' })
  findAllPaginated(@Query() query: SearchTitleDeedServiceDocumentTypeDto) {
    return this.service.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service document type by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service document type by ID' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTitleDeedServiceDocumentTypeDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service document type by ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
