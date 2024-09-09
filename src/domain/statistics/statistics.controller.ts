import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthUser } from '@PedroCavallaro/focvs-utils';
import { AuthToken } from 'src/shared/types/auth-token.type';
import { GetWorkoutsBetweenDates } from './dto/get-workout-between-dates.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get('workouts-between-days')
  async getUserWorkoutsBetweenDates(
    @AuthUser() { id }: AuthToken,
    @Query() q: GetWorkoutsBetweenDates,
  ) {
    try {
      return await this.service.getUserWorkoutsBetweenDates(id, q.days);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - q.days);
      throw new InternalServerErrorException(
        `Failed to fetch workouts between ${pastDate} and ${new Date(Date.now())}.`,
      );
    }
  }

  @Get('last-workouts')
  async getUserLastThreeWorkouts(@AuthUser() { id }: AuthToken) {
    try {
      return await this.service.lastThreeWorkouts(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to fetch last three workouts.`,
      );
    }
  }

  @Get('hours-in-week-month')
  async getHours(@AuthUser() { id }: AuthToken) {
    try {
      return await this.service.hoursInWeekAndMonth(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to fetch hours in week and month.`,
      );
    }
  }

  @Get('workouts-in-week-month')
  async getWorkoutAmount(@AuthUser() { id }: AuthToken) {
    try {
      return await this.service.workoutsInWeekAndMonth(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to fetch workouts in week and month.`,
      );
    }
  }

  @Get('last-improvements')
  async exercisesWithImprovements(@AuthUser() { id }: AuthToken) {
    try {
      return await this.service.exercisesWithImprovements(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to fetch last four improvements.`,
      );
    }
  }
}
