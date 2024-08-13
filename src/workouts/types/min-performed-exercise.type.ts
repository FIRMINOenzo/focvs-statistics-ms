import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MinPerformedExercise {
  @Expose()
  id: string;

  @Expose()
  exerciseId: string;

  @Expose()
  setPosition: number;

  @Expose()
  reps: number;

  @Expose()
  weight: number;

  @Expose()
  hasImprovements: boolean;
}
