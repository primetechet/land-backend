import { Test, TestingModule } from '@nestjs/testing';
import { PermissionResourceService } from './permission-resource.service';

describe('PermissionResourceService', () => {
  let service: PermissionResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionResourceService],
    }).compile();

    service = module.get<PermissionResourceService>(PermissionResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
