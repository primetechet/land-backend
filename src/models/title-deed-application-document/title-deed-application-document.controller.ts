import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BufferedFile } from 'src/common/types/buffered-file.type';
import { CreateTitleDeedApplicationDocumentDto } from './dto';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { TitleDeedApplicationDocumentService } from './title-deed-application-document.service';
@ApiTags('title-deed-application-client-document')
@Controller('title-deed-application-client-document')
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
}
