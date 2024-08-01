import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { CreateWorkoutDto as CreatePerformedWorkoutDto } from './dto/create-workout.dto';
import { plainToClass } from 'class-transformer';
import { CreatePerformedWorkoutCommand } from './commands/create-performed-workout/create-performed-workout.command';
import { GetPerformedWorkoutQuery } from './queries/get-performed-workout/get-performed-workout.query';

@Controller()
export class WorkoutsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @MessagePattern('createPerformedWorkout')
  async create(@Payload() createPerformedWorkoutDto: CreatePerformedWorkoutDto) {
    const command = plainToClass(CreatePerformedWorkoutCommand, createPerformedWorkoutDto);
    const id = this.commandBus.execute(command);
  }

  // @MessagePattern('findAllWorkouts')
  // findAll() {
  //   return this.workoutsService.findAll();
  // }

  @MessagePattern('findOneWorkout')
  async findOne(@Payload() id: string) {
    const query = plainToClass(GetPerformedWorkoutQuery, { id });
    const performedWorkout = await this.queryBus.execute(query);
    return performedWorkout;
  }
}
