import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationClientDocumentService } from './title-deed-application-client-document.service';

describe('TitleDeedApplicationClientDocumentService', () => {
  let service: TitleDeedApplicationClientDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedApplicationClientDocumentService],
    }).compile();

    service = module.get<TitleDeedApplicationClientDocumentService>(TitleDeedApplicationClientDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
