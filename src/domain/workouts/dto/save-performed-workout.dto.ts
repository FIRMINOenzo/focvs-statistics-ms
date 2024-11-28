import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber
} from 'class-validator'

export class SavePerformedWorkoutDTO {
  // @IsNotEmpty()
  // @IsString()
  id: string

  info?: {
    started: boolean
    startedAt: number
    finishedAt?: number
  }

  // @IsNotEmpty()
  // @IsString()
  name: string

  exercises: PerformedExercise[]
}

export class PerformedExercise {
  @IsNotEmpty()
  @IsString()
  id: string

  //   @IsNotEmpty()
  //   @IsString()
  //   name?: string

  // @IsNotEmpty()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => PerformedSet)
  sets: PerformedSet[]

  //   gif_url?: string
}

export class PerformedSet {
  // @IsNumber()
  // @IsNotEmpty()
  set_number: number

  // @IsNumber()
  // @IsNotEmpty()
  reps: number

  done: boolean

  // @IsNumber()
  // @IsNotEmpty()
  weight: number
}
