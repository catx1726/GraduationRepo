import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';

@Module({
  controllers: [MeetingController]
})
export class MeetingModule {}
