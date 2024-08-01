import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPerformedWorkoutQuery } from './get-performed-workout.query';
import { PerformedWorkoutDto } from './get-performed-workout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinPerformedExercise } from 'src/workouts/types/min-performed-exercise.type';
import { PerformedExercise, PerformedWorkout } from '@prisma/client';

type PrismaQueryType = {
  PerformedExercises: PerformedExercise[];
} & PerformedWorkout;

@QueryHandler(GetPerformedWorkoutQuery)
export class GetPerformedWorkoutHandler
  implements IQueryHandler<GetPerformedWorkoutQuery, PerformedWorkoutDto>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetPerformedWorkoutQuery): Promise<PerformedWorkoutDto | null> {
    try {
      const data = await this.prismaService.performedWorkout.findUniqueOrThrow({
        where: { id: query.id },
        include: { PerformedExercises: true }
      });

      return this.performedWorkoutToDto(data);
    } catch (error) {
      return null;
    }
  }

  private performedWorkoutToDto(data: PrismaQueryType): PerformedWorkoutDto {
    const performedWorkoutDto = new PerformedWorkoutDto();
    performedWorkoutDto.id = data.id;
    performedWorkoutDto.userId = data.userId;
    performedWorkoutDto.name = data.name;
    performedWorkoutDto.spentMinutes = data.spentMinutes;
    performedWorkoutDto.date = data.date;

    performedWorkoutDto.exercises = data.PerformedExercises.map((performedExercise) => {
      const minPerformedExercise = new MinPerformedExercise();
      minPerformedExercise.id = performedExercise.id;
      minPerformedExercise.exerciseId = performedExercise.exerciseId;
      minPerformedExercise.weight = performedExercise.weight;
      minPerformedExercise.reps = performedExercise.reps;
      minPerformedExercise.hasImprovements = performedExercise.hasImprovements;

      return minPerformedExercise;
    });

    return performedWorkoutDto;
  }
}
