import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';

@Module({
  controllers: [ActivitiesController]
})
export class ActivitiesModule {}
