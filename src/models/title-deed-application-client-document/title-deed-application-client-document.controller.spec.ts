import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationClientDocumentController } from './title-deed-application-client-document.controller';
import { TitleDeedApplicationClientDocumentService } from './title-deed-application-client-document.service';

describe('TitleDeedApplicationClientDocumentController', () => {
  let controller: TitleDeedApplicationClientDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedApplicationClientDocumentController],
      providers: [TitleDeedApplicationClientDocumentService],
    }).compile();

    controller = module.get<TitleDeedApplicationClientDocumentController>(TitleDeedApplicationClientDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
