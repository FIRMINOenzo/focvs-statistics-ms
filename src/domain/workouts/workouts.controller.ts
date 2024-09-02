import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Controller()
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @MessagePattern('createWorkout')
  create(@Payload() createWorkoutDto: CreateWorkoutDto) {
    return this.workoutsService.create(createWorkoutDto);
  }

  @MessagePattern('findAllWorkouts')
  findAll() {
    return this.workoutsService.findAll();
  }

  @MessagePattern('findOneWorkout')
  findOne(@Payload() id: number) {
    return this.workoutsService.findOne(id);
  }
}
