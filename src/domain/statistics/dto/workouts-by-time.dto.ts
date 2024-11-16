import { PerformedWorkout } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class HoursSpentDTO {
  @IsString()
  @IsNotEmpty()
  week: string

  @IsString()
  @IsNotEmpty()
  month: string
}

export class PerformedWorkoutsInDTO {
  week: PerformedWorkout[]
  month: PerformedWorkout[]
}
