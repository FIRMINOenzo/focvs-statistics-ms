import { Injectable } from '@nestjs/common'
import { CreateExerciseDto, CreateWorkoutDto } from './dto/create-workout.dto'
import { ExercisePr, PerformedWorkout } from '@prisma/client'
import { PrismaService } from '@/config/db'

@Injectable()
export class WorkoutsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createWorkoutDto: CreateWorkoutDto) {
    const { userId, name, performedAt, spentMinutes, exercises } = createWorkoutDto

    this.prismaService.$transaction(async (prisma) => {
      const exercisesToCreate = exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        setPosition: exercise.set_number,
        reps: exercise.reps,
        weight: exercise.weight
      }))

      prisma.performedWorkout.create({
        data: {
          userId: userId,
          name: name || null,
          performedAt: new Date(performedAt).toISOString(),
          spentMinutes: spentMinutes,
          performed_exercises: {
            create: exercisesToCreate
          }
        },
        include: {
          performed_exercises: true
        }
      })
    })

    const promises = exercises.map((e) => this.validateExercisePR(userId, e));

    return await Promise.allSettled(promises)
  }

  async findAll(userId: string): Promise<PerformedWorkout[] | null> {
    try {
      return await this.prismaService.performedWorkout.findMany({
        where: { userId }
      })
    } catch (_) {
      return
    }
  }

  async findOne(userId: string, id: string): Promise<PerformedWorkout | null> {
    try {
      return await this.prismaService.performedWorkout.findFirst({
        where: { userId, id }
      })
    } catch (_) {
      return
    }
  }

  private async validateExercisePR(
    userId: string,
    performedExercise: CreateExerciseDto,
  ) {
    const { weight, reps, exerciseId } = performedExercise;

    const existingPR = await this.prismaService.exercisePr.findFirst({
      where: { userId, exerciseId },
    })

    if (!existingPR) {
      this.prismaService.exercisePr.create({
        data: { userId, exerciseId, reps, weight },
      })
      return
    }

    if (this.isNewPersonalRecord(existingPR, weight, reps)) {
      this.prismaService.exercisePr.create({
        data: { userId, exerciseId, reps, weight },
      })
    }

    return
  }

  private isNewPersonalRecord(
    existingPR: ExercisePr,
    weight: number,
    reps: number,
  ): boolean {
    return (
      weight > existingPR.weight ||
      (reps > existingPR.reps && weight === existingPR.weight)
    )
  }
}
