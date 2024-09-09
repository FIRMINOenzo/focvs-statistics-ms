import { IsNotEmpty } from 'class-validator';

export class GetWorkoutsBetweenDates {
  @IsNotEmpty()
  days: number;
}
