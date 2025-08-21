import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BufferedFile } from 'src/common/types/buffered-file.type';
import { CreateTitleDeedApplicationDocumentDto } from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { TitleDeedApplicationDocumentService } from './title-deed-application-document.service';
@ApiTags('title-deed-application-document')
@Controller('title-deed-application-document')
@ApiBearerAuth()
export class TitleDeedApplicationDocumentController {
  constructor(
    private readonly titleDeedApplicationDocumentService: TitleDeedApplicationDocumentService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async create(
    @Request() request: EmployeeTokenClaim,
    @Body()
    createTitleDeedApplicationDocumentDto: CreateTitleDeedApplicationDocumentDto,
    @UploadedFiles() file: BufferedFile,
  ) {
    return this.titleDeedApplicationDocumentService.create(
      createTitleDeedApplicationDocumentDto,
      file,
      request,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document by ID' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully.' })
  @ApiParam({ name: 'id', description: 'Document ID', type: String })
  remove(@Param('id') id: string) {
    return this.titleDeedApplicationDocumentService.remove(id);
  }
}
