import { Test, TestingModule } from '@nestjs/testing';
import { LandGradeController } from './land-grade.controller';
import { LandGradeService } from './land-grade.service';

describe('LandGradeController', () => {
  let controller: LandGradeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandGradeController],
      providers: [LandGradeService],
    }).compile();

    controller = module.get<LandGradeController>(LandGradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
