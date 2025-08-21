import { Module } from '@nestjs/common';
import { TitleDeedServiceDocumentTypeService } from './title-deed-service-document-type.service';
import { TitleDeedServiceDocumentTypeController } from './title-deed-service-document-type.controller';

@Module({
  controllers: [TitleDeedServiceDocumentTypeController],
  providers: [TitleDeedServiceDocumentTypeService],
})
export class TitleDeedServiceDocumentTypeModule {}
