import { Injectable } from '@nestjs/common'
import { ExercisePr, PerformedWorkout } from '@prisma/client'
import { PrismaService } from '@/config/db'
import { PerformedExercise, PerformedSet, SavePerformedWorkoutDTO } from './dto'

@Injectable()
export class WorkoutsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, savePerformedWorkout: SavePerformedWorkoutDTO) {
    const { name, info, exercises } = savePerformedWorkout

    const differenceInMilliseconds = Math.abs(info.startedAt - info.finishedAt)

    const spentMinutes = differenceInMilliseconds / (1000 * 60)

    console.log(savePerformedWorkout)
    this.prismaService.$transaction(async (prisma) => {
      const exercisesToCreate = this.parseWorkoutSets(savePerformedWorkout.exercises)

      await prisma.performedWorkout.create({
        data: {
          userId: userId,
          name: name,
          performedAt: new Date(info.startedAt).toISOString(),
          spentMinutes: spentMinutes,
          performed_exercises: {
            create: exercisesToCreate
          }
        },
        include: {
          performed_exercises: true
        }
      })

      const promises = []

      for (const exercise of exercises) {
        for (const set of exercise.sets) {
          const validated = this.validateExercisePR(userId, exercise.id, set)

          promises.push(validated)
        }
      }

      return await Promise.allSettled(promises)
    })
  }

  parseWorkoutSets(performedExercises: PerformedExercise[]) {
    const setsToCreate = []

    for (const exercise of performedExercises) {
      for (const set of exercise.sets) {
        setsToCreate.push({
          exerciseId: exercise.id,
          setNumber: set.set_number,
          reps: set.reps,
          done: set.done,
          weight: set.weight
        })
      }
    }

    return setsToCreate
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

  private async validateExercisePR(userId: string, exerciseId: string, performedSet: PerformedSet) {
    const { weight, reps } = performedSet

    const existingPR = await this.prismaService.exercisePr.findFirst({
      where: { userId, exerciseId }
    })

    if (!existingPR) {
      this.prismaService.exercisePr.create({
        data: { userId, exerciseId, reps, weight }
      })
      return
    }

    if (this.isNewPersonalRecord(existingPR, weight, reps)) {
      this.prismaService.exercisePr.create({
        data: { userId, exerciseId, reps, weight }
      })
    }

    return
  }

  private isNewPersonalRecord(existingPR: ExercisePr, weight: number, reps: number): boolean {
    return weight > existingPR.weight || (reps > existingPR.reps && weight === existingPR.weight)
  }
}
