import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedServiceRequirementController } from './title-deed-service-requirement.controller';
import { TitleDeedServiceRequirementService } from './title-deed-service-requirement.service';

describe('TitleDeedServiceRequirementController', () => {
  let controller: TitleDeedServiceRequirementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedServiceRequirementController],
      providers: [TitleDeedServiceRequirementService],
    }).compile();

    controller = module.get<TitleDeedServiceRequirementController>(TitleDeedServiceRequirementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
