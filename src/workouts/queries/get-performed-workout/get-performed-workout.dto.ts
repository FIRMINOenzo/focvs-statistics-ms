import { MinPerformedExercise } from '../../types/min-performed-exercise.type';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class PerformedWorkoutDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  name: string;

  @Expose()
  spentMinutes: number;

  @Expose()
  date: Date;

  @Type(() => MinPerformedExercise)
  @Expose()
  exercises: MinPerformedExercise[];
}
