import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';

import { AuthUser, JwtPayloadDTO } from '@PedroCavallaro/focvs-utils';

import { StatisticsService } from './statistics.service';
import { GetWorkoutsBetweenDates } from './dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get('workouts')
  async loadAllWorkouts(@AuthUser() { id }: JwtPayloadDTO) {
    try {
      return await this.service.loadAllWorkouts(id);
    } catch (_) {
      throw new InternalServerErrorException('Failed to fetch all workouts.');
    }
  }

  @Get('workouts-between-days')
  async getUserWorkoutsBetweenDates(
    @AuthUser() { id }: JwtPayloadDTO,
    @Query() q: GetWorkoutsBetweenDates,
  ) {
    try {
      return await this.service.getUserWorkoutsBetweenDates(id, q.days);
    } catch (_) {
      const pastDate = new Date();

      pastDate.setDate(pastDate.getDate() - q.days);

      throw new InternalServerErrorException(
        `Failed to fetch workouts between ${pastDate} and ${new Date(Date.now())}.`,
      );
    }
  }

  @Get('last-workouts')
  async getUserLastThreeWorkouts(@AuthUser() { id }: JwtPayloadDTO) {
    try {
      return await this.service.lastThreeWorkouts(id);
    } catch (_) {
      throw new InternalServerErrorException(
        'Failed to fetch last three workouts.',
      );
    }
  }

  @Get('hours-in-week-month')
  async getHours(@AuthUser() { id }: JwtPayloadDTO) {
    try {
      return await this.service.hoursInWeekAndMonth(id);
    } catch (_) {
      throw new InternalServerErrorException(
        'Failed to fetch hours in week and month.',
      );
    }
  }

  @Get('workouts-in-week-month')
  async getWorkoutAmount(@AuthUser() { id }: JwtPayloadDTO) {
    try {
      return await this.service.workoutsInWeekAndMonth(id);
    } catch (_) {
      throw new InternalServerErrorException(
        'Failed to fetch workouts in week and month.',
      );
    }
  }

  @Get('last-improvements')
  async exercisesWithImprovements(@AuthUser() { id }: JwtPayloadDTO) {
    try {
      return await this.service.exercisesWithImprovements(id);
    } catch (_) {
      throw new InternalServerErrorException(
        'Failed to fetch last four improvements.',
      );
    }
  }
}
