import { Test, TestingModule } from '@nestjs/testing';
import { PropertyUseService } from './property-use.service';

describe('PropertyUseService', () => {
  let service: PropertyUseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyUseService],
    }).compile();

    service = module.get<PropertyUseService>(PropertyUseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
