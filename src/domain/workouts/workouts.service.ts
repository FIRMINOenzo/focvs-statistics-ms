import { Injectable } from '@nestjs/common';
import { CreateExerciseDto, CreateWorkoutDto } from './dto/create-workout.dto';
import { PerformedWorkout } from '@prisma/client';
import { PrismaService } from '@/config/db';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createWorkoutDto: CreateWorkoutDto) {
    const { user_id, name, performed_at, spent_minutes, exercises } =
      createWorkoutDto;


    this.prismaService.$transaction(async (prisma) => {
     
      const exercisesToCreate = exercises.map((exercise) => ({
        exerciseId: exercise.exercise_id,
        setPosition: exercise.set_position,
        reps: exercise.reps,
        weight: exercise.weight,
      }))

      prisma.performedWorkout.create({
        data: {
          userId: user_id,
          name: name || null,
          performedAt: new Date(performed_at).toISOString(),
          spentMinutes: spent_minutes,
          performed_exercises: {
            create: exercisesToCreate,
          },
        },
        include: {
          performed_exercises: true,
        },
      });
    });

    const promises = exercises.map((e) => this.upsertExercisePr(user_id, e)) 

    return await Promise.allSettled(promises)
  }

  async findAll(userId: string): Promise<PerformedWorkout[] | null> {
    try {
      return await this.prismaService.performedWorkout.findMany({
        where: { userId },
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async findOne(userId: string, id: string): Promise<PerformedWorkout | null> {
    try {
      return await this.prismaService.performedWorkout.findFirst({
        where: { userId, id },
      });
    } catch (error) {
      console.log(error);
      return;
    }
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
