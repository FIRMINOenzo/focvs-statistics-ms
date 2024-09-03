import { Injectable } from '@nestjs/common';
import { CreateExerciseDto, CreateWorkoutDto } from './dto/create-workout.dto';
import { PrismaService } from '../config/db/prisma/prisma.service';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createWorkoutDto: CreateWorkoutDto) {
    const { user_id, name, performed_at, spent_minutes, exercises } =
      createWorkoutDto;

    this.prismaService.$transaction(async (prisma) => {
      prisma.performedWorkout.create({
        data: {
          userId: user_id,
          name: name || null,
          performedAt: new Date(performed_at).toISOString(),
          spentMinutes: spent_minutes,
          performed_exercises: {
            create: exercises.map((exercise) => ({
              exerciseId: exercise.exercise_id,
              setPosition: exercise.set_position,
              reps: exercise.reps,
              weight: exercise.weight,
            })),
          },
        },
        include: {
          performed_exercises: true,
        },
      });
    });

    for (const exercise of exercises) {
      try {
        this.upsertExercisePr(user_id, exercise);
      } catch (error) {
        console.error(error);
      }
    }
  }

  findAll() {
    return `This action returns all workouts`;
  }

  findOne(id: string) {
    return `This action returns a #${id} workout`;
  }

  private async upsertExercisePr(
    userId: string,
    performedExercise: CreateExerciseDto,
  ) {
    const { weight, reps, exercise_id } = performedExercise;

    try {
      const existingPr = await this.prismaService.exercisePr.findFirst({
        where: {
          userId,
          exerciseId: exercise_id,
        },
      });

      if (!existingPr) {
        this.prismaService.exercisePr.create({
          data: {
            userId,
            exerciseId: exercise_id,
            reps,
            weight,
            updatedAt: new Date(Date.now()).toISOString(),
          },
        });
        return;
      }

      if (weight > existingPr.weight) {
        existingPr.weight = weight;
        existingPr.reps = reps;
      } else if (reps > existingPr.reps && weight === existingPr.weight) {
        existingPr.reps = reps;
      }

      this.prismaService.exercisePr.update({
        data: {
          ...existingPr,
        },
        where: {
          id: existingPr.id,
        },
      });
    } catch (error) {
      console.error(`Failed to upsert PR for exercise ${exercise_id}:`, error);
      throw error;
    }
  }
}
