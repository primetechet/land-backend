import { Module } from '@nestjs/common';
import { PlotService } from './plot.service';
import { PlotController } from './plot.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PlotController],
  providers: [PlotService],
})
export class PlotModule {}
