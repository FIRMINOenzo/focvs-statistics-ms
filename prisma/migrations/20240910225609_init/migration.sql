-- CreateTable
CREATE TABLE "PerformedWorkout" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "performed_at" TIMESTAMP NOT NULL,
    "spent_minutes" INTEGER NOT NULL,

    CONSTRAINT "PerformedWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformedExercise" (
    "id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "performed_workout_id" TEXT NOT NULL,
    "set_position" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PerformedExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExercisePr" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "ExercisePr_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PerformedExercise" ADD CONSTRAINT "PerformedExercise_performed_workout_id_fkey" FOREIGN KEY ("performed_workout_id") REFERENCES "PerformedWorkout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
