import { Test, TestingModule } from '@nestjs/testing';
import { WoredaService } from './woreda.service';

describe('WoredaService', () => {
  let service: WoredaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WoredaService],
    }).compile();

    service = module.get<WoredaService>(WoredaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
