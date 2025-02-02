/*
  Warnings:

  - The values [AIRPORT,AIRPORT_CONDITION] on the enum `LogModel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LogModel_new" AS ENUM ('VIDEO_MAP', 'SECTOR_MAPPING', 'AIRSPACE_CONDITION_CONTAINER', 'AIRSPACE_CONDITION', 'RADAR_FACILITY');
ALTER TABLE "Log" ALTER COLUMN "model" TYPE "LogModel_new" USING ("model"::text::"LogModel_new");
ALTER TYPE "LogModel" RENAME TO "LogModel_old";
ALTER TYPE "LogModel_new" RENAME TO "LogModel";
DROP TYPE "LogModel_old";
COMMIT;
