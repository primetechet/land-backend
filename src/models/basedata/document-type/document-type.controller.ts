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
import { DocumentTypeService } from './document-type.service';
import {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
  SearchDocumentTypeDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Document Types')
@Controller('document-type')
export class DocumentTypeController {
  constructor(private readonly service: DocumentTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document type' })
  create(@Body() createDto: CreateDocumentTypeDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all document types' })
  findAll(@Query() query: SearchDocumentTypeDto) {
    return this.service.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated document types' })
  findAllPaginated(@Query() query: SearchDocumentTypeDto) {
    return this.service.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document type by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document type by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateDocumentTypeDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document type by ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
