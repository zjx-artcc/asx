/*
  Warnings:

  - You are about to drop the column `icao` on the `AirportCondition` table. All the data in the column will be lost.
  - Added the required column `airportId` to the `AirportCondition` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AirportCondition" DROP CONSTRAINT "AirportCondition_icao_fkey";

-- AlterTable
ALTER TABLE "AirportCondition" DROP COLUMN "icao",
ADD COLUMN     "airportId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AirportCondition" ADD CONSTRAINT "AirportCondition_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
