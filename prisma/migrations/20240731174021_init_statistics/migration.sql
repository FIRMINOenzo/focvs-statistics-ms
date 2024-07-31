-- CreateTable
CREATE TABLE "PerformedWorkout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "spentMinutes" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformedWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformedExercise" (
    "id" TEXT NOT NULL,
    "performedWorkoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "hasImprovements" BOOLEAN NOT NULL,

    CONSTRAINT "PerformedExercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PerformedExercise" ADD CONSTRAINT "PerformedExercise_performedWorkoutId_fkey" FOREIGN KEY ("performedWorkoutId") REFERENCES "PerformedWorkout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
