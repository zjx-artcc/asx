/*
  Warnings:

  - You are about to drop the column `airportConditionId` on the `MappingJson` table. All the data in the column will be lost.
  - You are about to drop the `Airport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AirportCondition` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sectorMappingId,videoMapId,airspaceConditionId]` on the table `MappingJson` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AirportCondition" DROP CONSTRAINT "AirportCondition_airportId_fkey";

-- DropForeignKey
ALTER TABLE "MappingJson" DROP CONSTRAINT "MappingJson_airportConditionId_fkey";

-- DropIndex
DROP INDEX "MappingJson_sectorMappingId_videoMapId_airportConditionId_key";

-- AlterTable
ALTER TABLE "MappingJson" DROP COLUMN "airportConditionId",
ADD COLUMN     "airspaceConditionId" TEXT;

-- DropTable
DROP TABLE "Airport";

-- DropTable
DROP TABLE "AirportCondition";

-- CreateTable
CREATE TABLE "AirspaceConditionContainer"
(
    "id"    TEXT    NOT NULL,
    "name"  TEXT    NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AirspaceConditionContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirspaceCondition"
(
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "containerId" TEXT NOT NULL,

    CONSTRAINT "AirspaceCondition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AirspaceConditionContainer_name_key" ON "AirspaceConditionContainer" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "MappingJson_sectorMappingId_videoMapId_airspaceConditionId_key" ON "MappingJson" ("sectorMappingId", "videoMapId", "airspaceConditionId");

-- AddForeignKey
ALTER TABLE "MappingJson"
    ADD CONSTRAINT "MappingJson_airspaceConditionId_fkey" FOREIGN KEY ("airspaceConditionId") REFERENCES "AirspaceCondition" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirspaceCondition"
    ADD CONSTRAINT "AirspaceCondition_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "AirspaceConditionContainer" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
