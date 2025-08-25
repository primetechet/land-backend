import { Test, TestingModule } from '@nestjs/testing';
import { PlotPropertyController } from './plot-property.controller';
import { PlotPropertyService } from './plot-property.service';

describe('PlotPropertyController', () => {
  let controller: PlotPropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlotPropertyController],
      providers: [PlotPropertyService],
    }).compile();

    controller = module.get<PlotPropertyController>(PlotPropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
