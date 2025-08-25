import { Module } from '@nestjs/common';
import { PlotPropertyService } from './plot-property.service';
import { PlotPropertyController } from './plot-property.controller';

@Module({
  controllers: [PlotPropertyController],
  providers: [PlotPropertyService],
})
export class PlotPropertyModule {}
