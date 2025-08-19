import { Module } from '@nestjs/common';
import { PermissionActionController } from './permission-action.controller';
import { PermissionActionService } from './permission-action.service';

@Module({
  controllers: [PermissionActionController],
  providers: [PermissionActionService],
})
export class PermissionActionModule {}
