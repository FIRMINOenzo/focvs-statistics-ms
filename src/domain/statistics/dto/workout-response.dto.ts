import { Prisma } from '@prisma/client'

class WorkoutInclude implements Prisma.WorkoutInclude {
  user: {
    select: {
      id: true
      name: true
      image_url: true
    }
  }
}

export type PrismaWorkoutDTO = Prisma.WorkoutGetPayload<{
  include: WorkoutInclude
}>

export interface WorkoutResponseDTO {
  id: string
  name: string
  performedAt: Date
  spentMinutes: number
  public: boolean
  day: number
  exerciseAmount: number
  user: {
    id: string
    name: string
    image_url: string
  }
  exercises: Array<WorkoutItemResponse>
}

export interface WorkoutItemResponse {
  id: string
  name: string
  gif_url: string
  sets: ExerciseSet[]
}

export class ExerciseSet {
  id?: string
  set_number: number
  reps: number
  done: boolean
  weight: number
}

export interface WorkoutDetailsDTO {
  id: string
  name: string
  public: boolean
  day: number
  picture_url: string
  exerciseAmount: number
}
