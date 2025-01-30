/*
  Warnings:

  - You are about to drop the column `bannerKey` on the `SectorMapping` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sectorMappingId,videoMapId,airportConditionId]` on the table `MappingJson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `SectorMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `radarFacilityId` to the `SectorMapping` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MappingJson" DROP CONSTRAINT "MappingJson_videoMapId_fkey";

-- AlterTable
ALTER TABLE "SectorMapping" DROP COLUMN "bannerKey",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "radarFacilityId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RadarFacility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RadarFacility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RadarFacility_name_key" ON "RadarFacility"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MappingJson_sectorMappingId_videoMapId_airportConditionId_key" ON "MappingJson"("sectorMappingId", "videoMapId", "airportConditionId");

-- AddForeignKey
ALTER TABLE "SectorMapping" ADD CONSTRAINT "SectorMapping_radarFacilityId_fkey" FOREIGN KEY ("radarFacilityId") REFERENCES "RadarFacility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MappingJson" ADD CONSTRAINT "MappingJson_videoMapId_fkey" FOREIGN KEY ("videoMapId") REFERENCES "VideoMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
