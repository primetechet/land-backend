import { Module } from '@nestjs/common';
import { TitleDeedApplicationClientDocumentService } from './title-deed-application-client-document.service';
import { TitleDeedApplicationClientDocumentController } from './title-deed-application-client-document.controller';

@Module({
  controllers: [TitleDeedApplicationClientDocumentController],
  providers: [TitleDeedApplicationClientDocumentService],
})
export class TitleDeedApplicationClientDocumentModule {}
