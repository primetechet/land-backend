import { Module } from '@nestjs/common';
import { TitleDeedApplicationDocumentService } from './title-deed-application-document.service';
import { TitleDeedApplicationDocumentController } from './title-deed-application-document.controller';

@Module({
  controllers: [TitleDeedApplicationDocumentController],
  providers: [TitleDeedApplicationDocumentService],
})
export class TitleDeedApplicationDocumentModule {}
