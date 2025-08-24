import { Module } from '@nestjs/common';
import { LandGradeService } from './land-grade.service';
import { LandGradeController } from './land-grade.controller';

@Module({
  controllers: [LandGradeController],
  providers: [LandGradeService],
})
export class LandGradeModule {}
