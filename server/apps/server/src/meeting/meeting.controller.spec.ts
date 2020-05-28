import { Test, TestingModule } from '@nestjs/testing';
import { MeetingController } from './meeting.controller';

describe('Meeting Controller', () => {
  let controller: MeetingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingController],
    }).compile();

    controller = module.get<MeetingController>(MeetingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
