import { Module } from '@nestjs/common';
import { TitleDeedServiceBranchService } from './title-deed-service-branch.service';
import { TitleDeedServiceBranchController } from './title-deed-service-branch.controller';

@Module({
  controllers: [TitleDeedServiceBranchController],
  providers: [TitleDeedServiceBranchService],
})
export class TitleDeedServiceBranchModule {}
