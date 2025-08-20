import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedServiceBranchController } from './title-deed-service-branch.controller';
import { TitleDeedServiceBranchService } from './title-deed-service-branch.service';

describe('TitleDeedServiceBranchController', () => {
  let controller: TitleDeedServiceBranchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedServiceBranchController],
      providers: [TitleDeedServiceBranchService],
    }).compile();

    controller = module.get<TitleDeedServiceBranchController>(TitleDeedServiceBranchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
