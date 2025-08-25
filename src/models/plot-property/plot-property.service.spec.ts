import { Test, TestingModule } from '@nestjs/testing';
import { PlotPropertyService } from './plot-property.service';

describe('PlotPropertyService', () => {
  let service: PlotPropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlotPropertyService],
    }).compile();

    service = module.get<PlotPropertyService>(PlotPropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
