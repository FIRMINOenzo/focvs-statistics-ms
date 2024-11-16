import { Injectable } from '@nestjs/common'
import { CreateExerciseDto, CreateWorkoutDto } from './dto/create-workout.dto'
import { PerformedWorkout } from '@prisma/client'
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

    const promises = exercises.map((e) => this.upsertExercisePr(userId, e))

    return await Promise.allSettled(promises)
  }

  async findAll(userId: string): Promise<PerformedWorkout[] | null> {
    try {
      return await this.prismaService.performedWorkout.findMany({
        where: { userId }
      })
    } catch (error) {
      console.log(error)
      return
    }
  }

  async findOne(userId: string, id: string): Promise<PerformedWorkout | null> {
    try {
      return await this.prismaService.performedWorkout.findFirst({
        where: { userId, id }
      })
    } catch (error) {
      console.log(error)
      return
    }
  }

  private async upsertExercisePr(userId: string, performedExercise: CreateExerciseDto) {
    const { weight, reps, exerciseId } = performedExercise

    try {
      const existingPr = await this.prismaService.exercisePr.findFirst({
        where: {
          userId,
          exerciseId: exerciseId
        }
      })

      if (!existingPr) {
        this.prismaService.exercisePr.create({
          data: {
            userId,
            exerciseId: exerciseId,
            reps,
            weight,
            updatedAt: new Date(Date.now()).toISOString()
          }
        })

        return
      }

      if (weight > existingPr.weight) {
        existingPr.weight = weight
        existingPr.reps = reps
      } else if (reps > existingPr.reps && weight === existingPr.weight) {
        existingPr.reps = reps
      }

      this.prismaService.exercisePr.update({
        data: {
          ...existingPr
        },
        where: {
          id: existingPr.id
        }
      })
    } catch (error) {
      console.error(`Failed to upsert PR for exercise ${exerciseId}:`, error)
      throw error
    }
  }
}
