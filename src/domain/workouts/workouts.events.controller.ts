import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWorkoutDto } from './dto'
import { WorkoutsService } from './workouts.service';
import { Public } from '@PedroCavallaro/focvs-utils';

@Controller()
export class WorkoutsEventsController {
  constructor(private readonly service: WorkoutsService) {}

  @MessagePattern('createWorkout')
  @Public()
  create(@Payload() createWorkoutDto: CreateWorkoutDto) {
    return this.service.create(createWorkoutDto);
  }
}
