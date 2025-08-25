import { Module } from '@nestjs/common';
import { PropertyUseService } from './property-use.service';
import { PropertyUseController } from './property-use.controller';

@Module({
  controllers: [PropertyUseController],
  providers: [PropertyUseService],
})
export class PropertyUseModule {}
