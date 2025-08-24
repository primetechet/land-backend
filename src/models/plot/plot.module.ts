import { Module } from '@nestjs/common';
import { PlotService } from './plot.service';
import { PlotController } from './plot.controller';

@Module({
  controllers: [PlotController],
  providers: [PlotService],
})
export class PlotModule {}
