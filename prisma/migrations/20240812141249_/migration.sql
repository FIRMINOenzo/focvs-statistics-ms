/*
  Warnings:

  - Added the required column `setPosition` to the `PerformedExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PerformedExercise" ADD COLUMN     "setPosition" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PerformedWorkout" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
