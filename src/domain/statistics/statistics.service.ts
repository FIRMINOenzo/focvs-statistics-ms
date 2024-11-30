import { Injectable } from '@nestjs/common'
import { PerformedExercise, PerformedWorkout } from '@prisma/client'
import { PrismaService } from '@/config/db'
import { MonthHandler } from '@/shared/date/month.handler'
import { HoursSpentDTO, PerformedWorkoutsInDTO } from './dto'
import { ExerciseImprovementDTO } from './dto/exercise-improvement.dto'
import { WorkoutsService } from '../workouts'
import { TimeHandler } from './helpers/time'
import { PrismaWorkoutDTO, WorkoutResponseDTO } from './dto/workout-response.dto'

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workoutsService: WorkoutsService,
    private readonly repo: PrismaService
  ) {}

  async getPerformedWorkout(userId: string, date: string) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const performedWorkout = await this.repo.performedWorkout.findFirst({
      where: {
        performedAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        userId
      }
    })

    const workout = await this.repo.workout.findFirst({
      where: { id: performedWorkout.workoutId, userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image_url: true
          }
        }
      }
    })

    const performedExercises = await this.repo.performedExercise.findMany({
      where: {
        performedWorkout: {
          id: performedWorkout.id
        }
      },
      include: {
        exercise: {
          select: {
            gif_url: true,
            name: true
          }
        }
      }
    })

    return this.parseWorkoutReponse(workout, performedExercises, performedWorkout)
  }

  private parseWorkoutReponse(
    workout: PrismaWorkoutDTO,
    performedExercises: Array<PerformedExercise & { exercise: { gif_url: string; name: string } }>,
    performedWorkout: PerformedWorkout
  ): WorkoutResponseDTO {
    const exercises: WorkoutResponseDTO['exercises'] = []

    const buildedExercises: Record<string, number> = {}

    if (!workout) {
      return {} as WorkoutResponseDTO
    }

    if (performedExercises.length === 0) {
      return {
        ...workout,
        performedAt: performedWorkout.performedAt,
        spentMinutes: performedWorkout.spentMinutes,
        exerciseAmount: 0,
        exercises: []
      }
    }

    let exerciseAmount = 0

    for (const item of performedExercises) {
      if (buildedExercises[item.exerciseId]) {
        continue
      }

      exerciseAmount++

      const relatedItems = performedExercises.filter((i) => i.exerciseId === item.exerciseId)

      const sets = []

      relatedItems.map((set) =>
        sets.push({
          id: set.id,
          set_number: set.setNumber,
          done: set.done,
          reps: set.reps,
          weight: set.weight
        })
      )

      exercises.push({
        id: item.exerciseId,
        gif_url: item.exercise.gif_url,
        name: item.exercise.name,
        sets
      })

      buildedExercises[item.exerciseId] = 1
    }

    return {
      ...workout,
      performedAt: performedWorkout.performedAt,
      spentMinutes: performedWorkout.spentMinutes,
      exercises,
      exerciseAmount
    }
  }

  async loadAllWorkouts(userId: string) {
    const workouts = await this.workoutsService.findAll(userId)

    return workouts.map((workout) => {
      const date = new Date(workout.performedAt)
      return date.toISOString().split('T')[0]
    })
  }

  async getUserWorkoutsBetweenDates(userId: string, days: number) {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - days)

    const workoutsByMonth = await this.prismaService.$queryRaw<
      Array<{ month: string; count: bigint }>
    >`
      SELECT 
        TO_CHAR(performed_at, 'YYYY-MM') AS month,
        COUNT(*) AS count
      FROM "PerformedWorkout"
      WHERE user_id = ${userId} AND performed_at >= ${pastDate}
      GROUP BY month
      ORDER BY month;
    `

    return workoutsByMonth.map((workout) => {
      const [_, month] = workout.month.split('-')
      return {
        label: MonthHandler.instance.getMonth(Number(month)),
        value: Number(workout.count)
      }
    })
  }

  async lastThreeWorkouts(userId: string): Promise<PerformedWorkout[]> {
    return await this.prismaService.performedWorkout.findMany({
      where: { userId },
      orderBy: { performedAt: 'desc' },
      take: 3
    })
  }

  async hoursInWeekAndMonth(userId: string): Promise<HoursSpentDTO> {
    const [week, month] = await Promise.all([
      this.findHoursWorkingOutInRange(userId, TimeHandler.WEEK_INIT),
      this.findHoursWorkingOutInRange(userId, TimeHandler.MONTH_INIT)
    ])

    return { week, month }
  }

  async workoutsInWeekAndMonth(userId: string): Promise<PerformedWorkoutsInDTO> {
    const [week, month] = await Promise.all([
      this.findWorkoutsInRange(userId, TimeHandler.WEEK_INIT),
      this.findWorkoutsInRange(userId, TimeHandler.MONTH_INIT)
    ])

    return { week, month }
  }

  async exercisesWithImprovements(userId: string): Promise<Array<ExerciseImprovementDTO>> {
    const latestPRs = await this.prismaService.exercisePr.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      distinct: ['exerciseId'],
      take: 4
    })

    const exercisesWithProgress: ExerciseImprovementDTO[] = await Promise.all(
      latestPRs.map(async (pr) => {
        const oldPr = await this.prismaService.exercisePr.findFirst({
          where: {
            userId,
            exerciseId: pr.exerciseId,
            createdAt: { lt: pr.createdAt }
          },
          include: {
            exercise: {
              select: {
                id: true,
                gif_url: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })

        return {
          exercise: oldPr.exercise,
          pr: { reps: pr.reps, weight: pr.weight },
          oldPr: { reps: oldPr.reps, weight: oldPr.weight }
        }
      })
    )

    return exercisesWithProgress
  }

  async getUserEvolution(userId: string) {
    try {
      const volumeByMonth = await this.prismaService.$queryRaw<
        Array<{ year_month: string; volume: number }>
      >`
        WITH MonthlyStats AS (
        SELECT
          TO_CHAR(pw.performed_at, 'YYYY-MM') AS year_month,
          SUM(pe.weight * pe.reps) AS total_weight_reps,
          COUNT(distinct pw.id) AS total_workouts
        FROM
          public."PerformedWorkout" pw
        JOIN 
          public."PerformedExercise" pe
            ON
          pw.id = pe.performed_workout_id
        WHERE
          pw.user_id = ${userId}
        GROUP BY
          TO_CHAR(pw.performed_at, 'YYYY-MM')
        )
        SELECT
          year_month,
          ROUND(
            coalesce(
              (total_weight_reps / nullif(total_workouts,0))::numeric,0),
            2) AS volume
        FROM
          MonthlyStats
        ORDER BY
          TO_DATE(year_month, 'YYYY-MM');
      `

      if (volumeByMonth?.length < 1) {
        return []
      }

      return volumeByMonth.map((data) => {
        const [_, month] = data.year_month.split('-')
        return {
          label: MonthHandler.instance.getMonth(Number(month)),
          volume: data.volume
        }
      })
    } catch (_) {
      return []
    }
  }

  private async findHoursWorkingOutInRange(userId: string, range: Date): Promise<string> {
    const workouts = await this.prismaService.performedWorkout.findMany({
      where: {
        userId,
        performedAt: { gte: range }
      },
      select: { spentMinutes: true }
    })

    const totalHours = workouts.reduce((acc, workout) => acc + workout.spentMinutes, 0)

    return this.formatMinutesToHoursAndMinutes(totalHours)
  }

  private async findWorkoutsInRange(userId: string, range: Date): Promise<PerformedWorkout[]> {
    return await this.prismaService.performedWorkout.findMany({
      where: {
        userId,
        performedAt: { gte: range }
      }
    })
  }

  private formatMinutesToHoursAndMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return `${String(hours).padStart(2, '0')} horas, ${String(remainingMinutes).padStart(2, '0')} minutos`
  }
}
