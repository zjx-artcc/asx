/*
  Warnings:

  - A unique constraint covering the columns `[idsRadarSectorId]` on the table `SectorMapping` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "LogModel" ADD VALUE 'RADAR_FACILITY';

-- CreateIndex
CREATE UNIQUE INDEX "SectorMapping_idsRadarSectorId_key" ON "SectorMapping"("idsRadarSectorId");
