import { Body, Controller, Post } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { AuthUser } from '@PedroCavallaro/focvs-utils';
import { plainToClass } from 'class-transformer';

import { CreatePerformedWorkoutCommand } from './commands/create-performed-workout/create-performed-workout.command';
import { GetPerformedWorkoutQuery } from './queries/get-performed-workout/get-performed-workout.query';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { JwtTokenData } from 'src/shared/types/jwt-token-data.type';
import { MinPerformedExercise } from './types/min-performed-exercise.type';
import e from 'express';

@Controller('workouts')
export class WorkoutsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Post()
  async create(
    @AuthUser() { id }: JwtTokenData,
    @Body() createWorkoutDto: CreateWorkoutDto
  ) {
    const mappedExercises: Omit<MinPerformedExercise, 'id'>[] = [];
    createWorkoutDto.exercises.forEach((exercise) => {
      const exerciseId = exercise.id;
      exercise.sets.forEach((set) => {
        mappedExercises.push({
          exerciseId,
          hasImprovements: false,
          ...set,
        });
      });
    });

    const command = new CreatePerformedWorkoutCommand();
    command.userId = id;
    command.name = createWorkoutDto.name;
    command.date = new Date(createWorkoutDto.date);
    command.spentMinutes = createWorkoutDto.spentMinutes;
    command.exercises = mappedExercises;

    console.log(`createWorkoutDto.date => ${createWorkoutDto.date}`);
    console.log(`command.date => ${command.date}`);

    const workoutId = this.commandBus.execute(command);
    const query = plainToClass(GetPerformedWorkoutQuery, { workoutId });
    const performedWorkout = await this.queryBus.execute(query);
    return performedWorkout;
  }
}
