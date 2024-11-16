import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetWorkoutsBetweenDates {
  @IsNotEmpty()
  days: number;
}
