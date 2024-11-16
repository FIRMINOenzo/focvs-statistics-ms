/*
  Warnings:

  - You are about to drop the column `updated_at` on the `ExercisePr` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExercisePr" DROP COLUMN "updated_at",
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
