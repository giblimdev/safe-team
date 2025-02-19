/*
  Warnings:

  - You are about to drop the column `devId` on the `Functionality` table. All the data in the column will be lost.
  - You are about to drop the `_FunctionalityToFunctionalityItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FunctionalityToIdea` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ideaId` to the `Functionality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Functionality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `functionalityId` to the `FunctionalityItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FunctionalityItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_FunctionalityToFunctionalityItem" DROP CONSTRAINT "_FunctionalityToFunctionalityItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_FunctionalityToFunctionalityItem" DROP CONSTRAINT "_FunctionalityToFunctionalityItem_B_fkey";

-- DropForeignKey
ALTER TABLE "_FunctionalityToIdea" DROP CONSTRAINT "_FunctionalityToIdea_A_fkey";

-- DropForeignKey
ALTER TABLE "_FunctionalityToIdea" DROP CONSTRAINT "_FunctionalityToIdea_B_fkey";

-- AlterTable
ALTER TABLE "Functionality" DROP COLUMN "devId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ideaId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FunctionalityItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "functionalityId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "content" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "_FunctionalityToFunctionalityItem";

-- DropTable
DROP TABLE "_FunctionalityToIdea";

-- AddForeignKey
ALTER TABLE "Functionality" ADD CONSTRAINT "Functionality_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FunctionalityItem" ADD CONSTRAINT "FunctionalityItem_functionalityId_fkey" FOREIGN KEY ("functionalityId") REFERENCES "Functionality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
