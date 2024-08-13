import { SaveExercise } from '../types/save-exercise.type';

export class CreateWorkoutDto {
  name: string;
  date: string;
  spentMinutes: number;
  exercises: SaveExercise[];
}
