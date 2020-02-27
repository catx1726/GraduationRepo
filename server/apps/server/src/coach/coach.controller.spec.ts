import { Test, TestingModule } from '@nestjs/testing';
import { CoachController } from './coach.controller';

describe('Coach Controller', () => {
  let controller: CoachController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachController],
    }).compile();

    controller = module.get<CoachController>(CoachController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
