import { ExercisePr } from '@prisma/client'

export class ExerciseImprovementDTO {
  pr: Pick<ExercisePr, 'weight' | 'reps'>
  oldPr: Pick<ExercisePr, 'weight' | 'reps'>
  exercise: {
    name: string
    id: string
    gif_url: string
  }
}
