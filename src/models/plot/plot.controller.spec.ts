import { Test, TestingModule } from '@nestjs/testing';
import { PlotController } from './plot.controller';
import { PlotService } from './plot.service';

describe('PlotController', () => {
  let controller: PlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlotController],
      providers: [PlotService],
    }).compile();

    controller = module.get<PlotController>(PlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
