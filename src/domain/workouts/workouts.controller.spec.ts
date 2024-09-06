import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsHttpController } from './workouts.http.controller';
import { WorkoutsService } from './workouts.service';

describe('WorkoutsController', () => {
  let controller: WorkoutsHttpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsHttpController],
      providers: [WorkoutsService],
    }).compile();

    controller = module.get<WorkoutsHttpController>(WorkoutsHttpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
