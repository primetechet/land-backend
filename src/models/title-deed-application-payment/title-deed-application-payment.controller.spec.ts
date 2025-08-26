import { Test, TestingModule } from '@nestjs/testing';
import { TitleDeedApplicationPaymentController } from './title-deed-application-payment.controller';
import { TitleDeedApplicationPaymentService } from './title-deed-application-payment.service';

describe('TitleDeedApplicationPaymentController', () => {
  let controller: TitleDeedApplicationPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitleDeedApplicationPaymentController],
      providers: [TitleDeedApplicationPaymentService],
    }).compile();

    controller = module.get<TitleDeedApplicationPaymentController>(TitleDeedApplicationPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
