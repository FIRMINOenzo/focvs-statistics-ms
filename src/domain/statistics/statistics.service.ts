import { Injectable } from '@nestjs/common'
import { ExercisePr, PerformedWorkout } from '@prisma/client'
import { HoursSpentDTO, PerformedWorkoutsInDTO } from './dto'
import { PrismaService } from '@/config/db'
import { TimeHandler } from './helpers/time'
import { WorkoutsService } from '../workouts'
import { MonthHandler } from '@/shared/date/month.handler'
import { ExerciseImprovementDTO } from './dto/exercise-improvement.dto'

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workoutsService: WorkoutsService
  ) {}

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
      const [year, month] = workout.month.split('-')
      return {
        label: `${MonthHandler.instance.getMonth(Number(month))} ${year}`,
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
    });
  
    const exercisesWithProgress: ExerciseImprovementDTO[] = await Promise.all(
      latestPRs.map(async (pr) => {
        const oldPr = await this.prismaService.exercisePr.findFirst({
          where: {
            userId,
            exerciseId: pr.exerciseId,
            createdAt: { lt: pr.createdAt }
          },
          orderBy: { createdAt: 'desc' }
        })

        return {
          exerciseId: pr.exerciseId,
          pr: { reps: pr.reps, weight: pr.weight },
          oldPr: { reps: oldPr.reps, weight: oldPr.weight }
        }
      })
    )
  
    return exercisesWithProgress
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
