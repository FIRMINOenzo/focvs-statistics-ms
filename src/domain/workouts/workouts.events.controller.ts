import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { WorkoutsService } from './workouts.service';

@Controller()
export class WorkoutsEventsController {
  constructor(private readonly service: WorkoutsService) {}

  @MessagePattern('createWorkout')
  create(@Payload() createWorkoutDto: CreateWorkoutDto) {
    return this.service.create(createWorkoutDto);
  }
}
