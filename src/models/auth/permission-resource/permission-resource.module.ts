import { Module } from '@nestjs/common';
import { PermissionResourceService } from './permission-resource.service';
import { PermissionResourceController } from './permission-resource.controller';

@Module({
  controllers: [PermissionResourceController],
  providers: [PermissionResourceService],
})
export class PermissionResourceModule {}
