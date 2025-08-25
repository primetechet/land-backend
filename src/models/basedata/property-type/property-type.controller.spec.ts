import { Test, TestingModule } from '@nestjs/testing';
import { PropertyTypeController } from './property-type.controller';
import { PropertyTypeService } from './property-type.service';

describe('PropertyTypeController', () => {
  let controller: PropertyTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyTypeController],
      providers: [PropertyTypeService],
    }).compile();

    controller = module.get<PropertyTypeController>(PropertyTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
