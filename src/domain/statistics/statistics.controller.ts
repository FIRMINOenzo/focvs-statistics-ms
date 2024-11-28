import { Controller, Get, InternalServerErrorException, Query } from '@nestjs/common'
import { AuthUser, JwtPayloadDTO } from '@PedroCavallaro/focvs-utils'
import { StatisticsService } from './statistics.service'
import { GetWorkoutsBetweenDates } from './dto'

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get('evolution')
  async getUserEvolution(@AuthUser() { id }: JwtPayloadDTO) {
    return await this.service.getUserEvolution(id)
  }

  @Get('workouts')
  async loadAllWorkouts(@AuthUser() { id }: JwtPayloadDTO) {
    return await this.service.loadAllWorkouts(id)
  }

  @Get('workouts-between-days')
  async getUserWorkoutsBetweenDates(
    @AuthUser() { id }: JwtPayloadDTO,
    @Query() q: GetWorkoutsBetweenDates
  ) {
    try {
      console.log(q)
      return await this.service.getUserWorkoutsBetweenDates(id, q.days)
    } catch (_) {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - Number(q.days))

      throw new InternalServerErrorException(
        `Failed to fetch workouts between ${pastDate} and ${new Date(Date.now())}.`
      )
    }
  }

  @Get('last-workouts')
  async getUserLastThreeWorkouts(@AuthUser() { id }: JwtPayloadDTO) {
    return await this.service.lastThreeWorkouts(id)
  }

  @Get('hours-in-week-month')
  async getHours(@AuthUser() { id }: JwtPayloadDTO) {
    return await this.service.hoursInWeekAndMonth(id)
  }

  @Get('workouts-in-week-month')
  async getWorkoutAmount(@AuthUser() { id }: JwtPayloadDTO) {
    return await this.service.workoutsInWeekAndMonth(id)
  }

  @Get('last-improvements')
  async exercisesWithImprovements(@AuthUser() { id }: JwtPayloadDTO) {
    return await this.service.exercisesWithImprovements(id)
  }
}
