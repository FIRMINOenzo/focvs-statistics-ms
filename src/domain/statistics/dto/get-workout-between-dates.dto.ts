import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class GetWorkoutsBetweenDates {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  days: number
}
