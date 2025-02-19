-- DropForeignKey
ALTER TABLE "Functionality" DROP CONSTRAINT "Functionality_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "FunctionalityItem" DROP CONSTRAINT "FunctionalityItem_functionalityId_fkey";

-- AlterTable
ALTER TABLE "Functionality" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "FunctionalityItem" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Functionality" ADD CONSTRAINT "Functionality_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FunctionalityItem" ADD CONSTRAINT "FunctionalityItem_functionalityId_fkey" FOREIGN KEY ("functionalityId") REFERENCES "Functionality"("id") ON DELETE CASCADE ON UPDATE CASCADE;
