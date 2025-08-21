import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationDocumentService } from './title-deed-application-document.service';

describe('TitleDeedApplicationDocumentService', () => {
  let service: TitleDeedApplicationDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedApplicationDocumentService],
    }).compile();

    service = module.get<TitleDeedApplicationDocumentService>(TitleDeedApplicationDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
