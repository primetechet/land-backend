import { Test, TestingModule } from '@nestjs/testing';
import { PermissionActionService } from './permission-action.service';

describe('PermissionActionService', () => {
  let service: PermissionActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionActionService],
    }).compile();

    service = module.get<PermissionActionService>(PermissionActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
