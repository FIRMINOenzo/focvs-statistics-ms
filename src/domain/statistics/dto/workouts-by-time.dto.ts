import { PerformedWorkout } from '@prisma/client';

export class HoursSpentDTO {
  week: string;
  month: string;

  constructor(week: string, month: string) {
    this.week = week;
    this.month = month;
  }
}

export class PerformedWorkoutsInDTO {
  week: PerformedWorkout[];
  month: PerformedWorkout[];

  constructor(week: PerformedWorkout[], month: PerformedWorkout[]) {
    this.week = week;
    this.month = month;
  }
}
