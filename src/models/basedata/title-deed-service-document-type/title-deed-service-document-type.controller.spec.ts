import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedServiceDocumentTypeController } from './title-deed-service-document-type.controller';
import { TitleDeedServiceDocumentTypeService } from './title-deed-service-document-type.service';

describe('TitleDeedServiceDocumentTypeController', () => {
  let controller: TitleDeedServiceDocumentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedServiceDocumentTypeController],
      providers: [TitleDeedServiceDocumentTypeService],
    }).compile();

    controller = module.get<TitleDeedServiceDocumentTypeController>(TitleDeedServiceDocumentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
