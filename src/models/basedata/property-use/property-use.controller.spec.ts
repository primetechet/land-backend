import { Test, TestingModule } from '@nestjs/testing';
import { PropertyUseController } from './property-use.controller';
import { PropertyUseService } from './property-use.service';

describe('PropertyUseController', () => {
  let controller: PropertyUseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyUseController],
      providers: [PropertyUseService],
    }).compile();

    controller = module.get<PropertyUseController>(PropertyUseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
