import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  exerciseId: string

  @IsNotEmpty()
  @IsString()
  set_number: number

  @IsNotEmpty()
  @IsInt()
  reps: number

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  weight: number
}

export class CreateWorkoutDto {
  @IsNotEmpty()
  @IsString()
  userId: string

  @IsString()
  @IsOptional()
  name?: string

  @IsNotEmpty()
  @IsDateString({ strict: true })
  performedAt: string

  @IsNotEmpty()
  @IsInt()
  spentMinutes: number

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseDto)
  exercises: CreateExerciseDto[]
}
