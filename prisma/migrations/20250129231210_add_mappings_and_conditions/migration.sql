/*
  Warnings:

  - The values [JSON_MAPPING] on the enum `LogModel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LogModel_new" AS ENUM ('SECTOR_MAPPING', 'AIRPORT', 'AIRPORT_CONDITION');
ALTER TABLE "Log" ALTER COLUMN "model" TYPE "LogModel_new" USING ("model"::text::"LogModel_new");
ALTER TYPE "LogModel" RENAME TO "LogModel_old";
ALTER TYPE "LogModel_new" RENAME TO "LogModel";
DROP TYPE "LogModel_old";
COMMIT;

-- CreateTable
CREATE TABLE "SectorMapping" (
    "id" TEXT NOT NULL,
    "idsRadarSectorId" TEXT NOT NULL,
    "bannerKey" TEXT NOT NULL,

    CONSTRAINT "SectorMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MappingJson" (
    "id" TEXT NOT NULL,
    "jsonKey" TEXT NOT NULL,
    "airportConditionId" TEXT,
    "sectorMappingId" TEXT NOT NULL,

    CONSTRAINT "MappingJson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "icao" TEXT NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("icao")
);

-- CreateTable
CREATE TABLE "AirportCondition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icao" TEXT NOT NULL,

    CONSTRAINT "AirportCondition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MappingJson" ADD CONSTRAINT "MappingJson_airportConditionId_fkey" FOREIGN KEY ("airportConditionId") REFERENCES "AirportCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MappingJson" ADD CONSTRAINT "MappingJson_sectorMappingId_fkey" FOREIGN KEY ("sectorMappingId") REFERENCES "SectorMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirportCondition" ADD CONSTRAINT "AirportCondition_icao_fkey" FOREIGN KEY ("icao") REFERENCES "Airport"("icao") ON DELETE CASCADE ON UPDATE CASCADE;
