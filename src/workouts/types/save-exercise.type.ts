import { MinPerformedExercise } from './min-performed-exercise.type';

export type SaveExercise = {
  id: string;
  sets: Omit<MinPerformedExercise, 'id' | 'exerciseId' | 'hasImprovements'>[];
};
