import { IsNotEmpty, IsNumber } from 'class-validator'

export class GetWorkoutsBetweenDates {
  @IsNotEmpty()
  @IsNumber()
  days: number
}
