import { Module } from '@nestjs/common';
import { LandUseService } from './land-use.service';
import { LandUseController } from './land-use.controller';

@Module({
  controllers: [LandUseController],
  providers: [LandUseService],
})
export class LandUseModule {}
