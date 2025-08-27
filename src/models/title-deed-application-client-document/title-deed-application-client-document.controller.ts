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
import {
  CreateTitleDeedApplicationClientDocumentDto,
  RejectTitleDeedApplicationClientDocumentDto,
  VerifyTitleDeedApplicationClientDocumentDto,
} from './dto';
import { TitleDeedApplicationClientDocumentService } from './title-deed-application-client-document.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
@ApiTags('title-deed-application-client-document')
@Controller('title-deed-application-client-document')
@ApiBearerAuth()
export class TitleDeedApplicationClientDocumentController {
  constructor(
    private readonly titleDeedApplicationClientDocumentService: TitleDeedApplicationClientDocumentService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async create(
    @Request() request: EmployeeTokenClaim,
    @Body()
    createTitleDeedApplicationClientDocumentDto: CreateTitleDeedApplicationClientDocumentDto,
    @UploadedFiles() file: BufferedFile,
  ) {
    return this.titleDeedApplicationClientDocumentService.create(
      createTitleDeedApplicationClientDocumentDto,
      file,
      request,
    );
  }

  @ApiBearerAuth()
  @Post(':id/verify')
  verify(
    @Request() request,
    @Param('id') id: string,
    @Body()
    verifyTitleDeedApplicationClientDocumentDto: VerifyTitleDeedApplicationClientDocumentDto,
  ) {
    return this.titleDeedApplicationClientDocumentService.verify(
      id,
      verifyTitleDeedApplicationClientDocumentDto,
      request,
    );
  }

  @ApiBearerAuth()
  @Post(':id/reject')
  // @Resource([{ resource: RESOURCE.NEW_PASSPORT, actions: [ACTIONS.REJECT] }])
  reject(
    @Request() request,
    @Param('id') id: string,
    @Body()
    rejectTitleDeedApplicationClientDocumentDto: RejectTitleDeedApplicationClientDocumentDto,
  ) {
    return this.titleDeedApplicationClientDocumentService.reject(
      id,
      rejectTitleDeedApplicationClientDocumentDto,
      request,
    );
  }
}
