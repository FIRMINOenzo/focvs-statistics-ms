import { ExercisePr } from '@prisma/client'

export class ExerciseImprovementDTO {
  exerciseId: string
  pr: Pick<ExercisePr, 'weight' | 'reps'>
  oldPr: Pick<ExercisePr, 'weight' | 'reps'>
}
