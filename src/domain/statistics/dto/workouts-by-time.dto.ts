import { PerformedWorkout } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class HoursSpentDTO {
  @IsString()
  @IsNotEmpty()
  week: string;

  @IsString()
  @IsNotEmpty()
  month: string;

  constructor(week: string, month: string) {
    this.week = week;
    this.month = month;
  }
}

type WorkoutAmountInTime = {
  timeDescription: string;
  amount: number;
};

export class PerformedWorkoutsInDTO {
  week: PerformedWorkout[];
  month: PerformedWorkout[];

  constructor(week: PerformedWorkout[], month: PerformedWorkout[]) {
    this.week = week;
    this.month = month;
  }
}
