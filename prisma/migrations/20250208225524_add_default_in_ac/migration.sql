-- AlterTable
ALTER TABLE "AirspaceCondition"
    ADD COLUMN "defaultInActiveId" TEXT;

-- CreateTable
CREATE TABLE "ActiveConsolidationsDefaultConditions"
(
    "id" TEXT NOT NULL,

    CONSTRAINT "ActiveConsolidationsDefaultConditions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AirspaceCondition"
    ADD CONSTRAINT "AirspaceCondition_defaultInActiveId_fkey" FOREIGN KEY ("defaultInActiveId") REFERENCES "ActiveConsolidationsDefaultConditions" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
