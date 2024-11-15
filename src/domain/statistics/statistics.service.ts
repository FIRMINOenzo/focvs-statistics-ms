import { Injectable } from '@nestjs/common';
import { ExercisePr, PerformedWorkout } from '@prisma/client';
import { HoursSpentDTO, PerformedWorkoutsInDTO } from './dto';
import { PrismaService } from '@/config/db';
import { TimeHandler } from './helpers/time';
import { WorkoutsService } from '../workouts';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workoutsService: WorkoutsService,
  ) {}

  async loadAllWorkouts(userId: string) {
    const workouts = await this.workoutsService.findAll(userId);

    return workouts.map((workout) => {
      const date = new Date(workout.performedAt);
      return date.toISOString().split('T')[0];
    });
  }

  async getUserWorkoutsBetweenDates(
    userId: string,
    days: number,
  ): Promise<any> {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);

    const workoutsByMonth = await this.prismaService.$queryRaw<
      Array<{ month: string; count: number }>
    >`
      SELECT 
        DATE_TRUNC('month', "performedAt") AS month,
        COUNT(*) AS count
      FROM "performedWorkout"
      WHERE "userId" = ${userId} AND "performedAt" >= ${pastDate}
      GROUP BY month
      ORDER BY month;
    `;

    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    const result = workoutsByMonth.map((workout) => {
      const date = new Date(workout.month);
      return {
        label: monthNames[date.getUTCMonth()],
        value: workout.count,
      };
    });
  }

  async loadPrismaData() {
    const userId = 'user-123'; // Substitua pelo ID do usuário que deseja testar

    const workouts = [
      {
        name: 'Workout 1',
        performedAt: new Date('2023-01-15T10:00:00Z'),
        spentMinutes: 60,
      },
      {
        name: 'Workout 2',
        performedAt: new Date('2023-02-20T10:00:00Z'),
        spentMinutes: 45,
      },
      {
        name: 'Workout 3',
        performedAt: new Date('2023-03-10T10:00:00Z'),
        spentMinutes: 30,
      },
      {
        name: 'Workout 4',
        performedAt: new Date('2023-03-25T10:00:00Z'),
        spentMinutes: 50,
      },
      {
        name: 'Workout 5',
        performedAt: new Date('2023-04-05T10:00:00Z'),
        spentMinutes: 40,
      },
      {
        name: 'Workout 6',
        performedAt: new Date('2023-04-15T10:00:00Z'),
        spentMinutes: 55,
      },
      {
        name: 'Workout 7',
        performedAt: new Date('2023-05-01T10:00:00Z'),
        spentMinutes: 60,
      },
    ];

    for (const workout of workouts) {
      await this.prismaService.performedWorkout.create({
        data: {
          userId,
          name: workout.name,
          performedAt: workout.performedAt,
          spentMinutes: workout.spentMinutes,
        },
      });
    }

    console.log('Workouts inserted successfully');
  }

  async lastThreeWorkouts(userId: string): Promise<PerformedWorkout[]> {
    return await this.prismaService.performedWorkout.findMany({
      where: { userId },
      orderBy: { performedAt: 'desc' },
      take: 3,
    });
  }

  async hoursInWeekAndMonth(userId: string): Promise<HoursSpentDTO> {
    const [week, month] = await Promise.all([
      this.findHoursWorkingOutInRange(userId, TimeHandler.WEEK_INIT),
      this.findHoursWorkingOutInRange(userId, TimeHandler.MONTH_INIT),
    ]);

    return new HoursSpentDTO(week, month);
  }

  async workoutsInWeekAndMonth(
    userId: string,
  ): Promise<PerformedWorkoutsInDTO> {
    const [week, month] = await Promise.all([
      this.findWorkoutsInRange(userId, TimeHandler.WEEK_INIT),
      this.findWorkoutsInRange(userId, TimeHandler.MONTH_INIT),
    ]);

    return new PerformedWorkoutsInDTO(week, month);
  }

  async exercisesWithImprovements(userId: string): Promise<ExercisePr[]> {
    return await this.prismaService.exercisePr.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    });
  }

  private async findHoursWorkingOutInRange(
    userId: string,
    range: Date,
  ): Promise<string> {
    const workouts = await this.prismaService.performedWorkout.findMany({
      where: {
        userId,
        performedAt: { gte: range },
      },
      select: { spentMinutes: true },
    });

    const totalHours = workouts.reduce(
      (acc, workout) => acc + workout.spentMinutes,
      0,
    );

    return this.formatMinutesToHoursAndMinutes(totalHours);
  }

  private async findWorkoutsInRange(
    userId: string,
    range: Date,
  ): Promise<PerformedWorkout[]> {
    return await this.prismaService.performedWorkout.findMany({
      where: {
        userId,
        performedAt: { gte: range },
      },
    });
  }

  private formatMinutesToHoursAndMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${String(hours).padStart(2, '0')} horas, ${String(remainingMinutes).padStart(2, '0')} minutos`;
  }
}
