import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationDocumentController } from './title-deed-application-document.controller';
import { TitleDeedApplicationDocumentService } from './title-deed-application-document.service';

describe('TitleDeedApplicationDocumentController', () => {
  let controller: TitleDeedApplicationDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedApplicationDocumentController],
      providers: [TitleDeedApplicationDocumentService],
    }).compile();

    controller = module.get<TitleDeedApplicationDocumentController>(TitleDeedApplicationDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
