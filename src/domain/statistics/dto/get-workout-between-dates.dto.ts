import { IsInt, IsNotEmpty } from 'class-validator';

export class GetWorkoutsBetweenDates {
  @IsNotEmpty()
  @IsInt()
  days: number;
}
