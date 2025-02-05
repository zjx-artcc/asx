/*
  Warnings:

  - Added the required column `frequency` to the `SectorMapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SectorMapping"
    ADD COLUMN "frequency" TEXT NOT NULL;
