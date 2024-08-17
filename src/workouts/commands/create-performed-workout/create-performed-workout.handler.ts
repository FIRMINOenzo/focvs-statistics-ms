import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePerformedWorkoutCommand } from './create-performed-workout.command';
import { CreatePerformedWorkoutDto } from './create-performed-workout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinPerformedExercise } from 'src/workouts/types/min-performed-exercise.type';

type ExerciseExecutionParams = {
  weight: number;
  reps: number;
};
@CommandHandler(CreatePerformedWorkoutCommand)
export class CreatePerformedWorkoutHandler
  implements
    ICommandHandler<CreatePerformedWorkoutCommand, CreatePerformedWorkoutDto>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    command: CreatePerformedWorkoutCommand
  ): Promise<CreatePerformedWorkoutDto> {
    try {
      return await this.prismaService.performedWorkout.create({
        data: {
          userId: command.userId,
          name: command.name,
          spentMinutes: command.spentMinutes,
          date: command.date,
          PerformedExercises: {
            createMany: {
              data: command.exercises,
            },
          },
        },
      });
    } catch (error) {
      PrismaService.handleError(error);
    }
  }

  private calculateIfHasImprovements(
    exercises: Omit<MinPerformedExercise, 'id'>[]
  ) {
    exercises.forEach(async (exercise) => {
      const lastImprovement = await this.searchForImprovements(exercise);

      if (
        !lastImprovement ||
        exercise.weight > lastImprovement.weight ||
        exercise.reps > lastImprovement.reps
      ) {
        exercise.hasImprovements = true;
      }
    });
  }

  private async searchForImprovements(
    exercise: Omit<MinPerformedExercise, 'id'>
  ) {
    const lastImprovement = await this.prismaService.$queryRaw<
      ExerciseExecutionParams[]
    >`
      SELECT e.reps, e.weight 
      FROM performedExercise e 
      INNER JOIN performedWorkout w ON e.workoutId = w.id
      WHERE e.exerciseId = ${exercise.exerciseId} AND e.hasImprovements = true
      ORDER BY w.date DESC LIMIT 1`;

    if (lastImprovement.length > 0) {
      return lastImprovement[0];
    }

    return null;
  }
}
