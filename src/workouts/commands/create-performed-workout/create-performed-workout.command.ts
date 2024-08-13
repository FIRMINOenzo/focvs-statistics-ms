import { MinPerformedExercise } from 'src/workouts/types/min-performed-exercise.type';

export class CreatePerformedWorkoutCommand {
  userId: string;
  name: string;
  spentMinutes: number;
  date: Date;
  exercises: Omit<MinPerformedExercise, 'id'>[];
}
