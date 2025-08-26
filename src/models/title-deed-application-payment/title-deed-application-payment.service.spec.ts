import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationPaymentService } from './title-deed-application-payment.service';

describe('TitleDeedApplicationPaymentService', () => {
  let service: TitleDeedApplicationPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleDeedApplicationPaymentService],
    }).compile();

    service = module.get<TitleDeedApplicationPaymentService>(TitleDeedApplicationPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
