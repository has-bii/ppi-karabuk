/*
  Warnings:

  - You are about to drop the column `img` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "img",
ADD COLUMN     "image" VARCHAR(255);
