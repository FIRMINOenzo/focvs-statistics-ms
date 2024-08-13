import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPerformedWorkoutQuery } from './get-performed-workout.query';
import { PerformedWorkoutDto } from './get-performed-workout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinPerformedExercise } from 'src/workouts/types/min-performed-exercise.type';
import { PerformedExercise, PerformedWorkout } from '@prisma/client';
import { plainToClass } from 'class-transformer';

type PrismaQueryType = {
  PerformedExercises: PerformedExercise[];
} & PerformedWorkout;

@QueryHandler(GetPerformedWorkoutQuery)
export class GetPerformedWorkoutHandler
  implements IQueryHandler<GetPerformedWorkoutQuery, PerformedWorkoutDto>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetPerformedWorkoutQuery
  ): Promise<PerformedWorkoutDto | null> {
    try {
      const data = await this.prismaService.performedWorkout.findUniqueOrThrow({
        where: { id: query.id },
        include: { PerformedExercises: true },
      });

      return this.performedWorkoutToDto(data);
    } catch (error) {
      return null;
    }
  }

  private performedWorkoutToDto(data: PrismaQueryType): PerformedWorkoutDto {
    const exercises = data.PerformedExercises.map((performedExercise) => {
      return plainToClass(MinPerformedExercise, {
        ...performedExercise,
      });
    });

    return plainToClass(PerformedWorkoutDto, {
      ...data,
      exercises,
    });
  }
}
