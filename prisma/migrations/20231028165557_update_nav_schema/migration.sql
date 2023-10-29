/*
  Warnings:

  - You are about to drop the `nav_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "nav_items" DROP CONSTRAINT "nav_items_navId_fkey";

-- AlterTable
ALTER TABLE "nav_lists" ADD COLUMN     "navlistId" INTEGER;

-- DropTable
DROP TABLE "nav_items";

-- AddForeignKey
ALTER TABLE "nav_lists" ADD CONSTRAINT "nav_lists_navlistId_fkey" FOREIGN KEY ("navlistId") REFERENCES "nav_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
