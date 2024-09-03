import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  exercise_id: string;

  @IsNotEmpty()
  @IsString()
  set_position: number;

  @IsNotEmpty()
  @IsInt()
  reps: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  weight: number;
}

export class CreateWorkoutDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsDateString({ strict: true })
  performed_at: string;

  @IsNotEmpty()
  @IsInt()
  spent_minutes: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseDto)
  exercises: CreateExerciseDto[];
}
