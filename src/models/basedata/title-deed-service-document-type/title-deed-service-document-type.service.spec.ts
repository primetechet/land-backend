import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedServiceDocumentTypeService } from './title-deed-service-document-type.service';

describe('TitleDeedServiceDocumentTypeService', () => {
  let service: TitleDeedServiceDocumentTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedServiceDocumentTypeService],
    }).compile();

    service = module.get<TitleDeedServiceDocumentTypeService>(TitleDeedServiceDocumentTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
