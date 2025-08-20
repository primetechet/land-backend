import { Test, TestingModule } from '@nestjs/testing';
import { WoredaController } from './woreda.controller';
import { WoredaService } from './woreda.service';

describe('WoredaController', () => {
  let controller: WoredaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WoredaController],
      providers: [WoredaService],
    }).compile();

    controller = module.get<WoredaController>(WoredaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
