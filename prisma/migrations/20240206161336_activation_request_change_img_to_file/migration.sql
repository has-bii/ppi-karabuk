/*
  Warnings:

  - You are about to drop the column `img` on the `activation_requests` table. All the data in the column will be lost.
  - Added the required column `file` to the `activation_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activation_requests" DROP COLUMN "img",
ADD COLUMN     "file" TEXT NOT NULL;
