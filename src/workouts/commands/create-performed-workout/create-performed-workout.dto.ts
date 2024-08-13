import { Prisma } from '@prisma/client';

export interface CreatePerformedWorkoutDto
  extends Prisma.PerformedWorkoutGetPayload<unknown> {}
