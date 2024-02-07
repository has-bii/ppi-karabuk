/*
  Warnings:

  - You are about to drop the column `noPaspor` on the `DatabaseMahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `kimlikId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `DatabaseMahasiswa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[passportId]` on the table `DatabaseMahasiswa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ikametId]` on the table `DatabaseMahasiswa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ikametId` to the `DatabaseMahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passportId` to the `DatabaseMahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `DatabaseMahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_studentId_kimlikId_key";

-- DropIndex
DROP INDEX "users_kimlikId_key";

-- DropIndex
DROP INDEX "users_studentId_key";

-- AlterTable
ALTER TABLE "DatabaseMahasiswa" DROP COLUMN "noPaspor",
ADD COLUMN     "ikametId" VARCHAR(11) NOT NULL,
ADD COLUMN     "passportId" VARCHAR(255) NOT NULL,
ADD COLUMN     "studentId" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "kimlikId",
DROP COLUMN "studentId";

-- CreateIndex
CREATE UNIQUE INDEX "DatabaseMahasiswa_studentId_key" ON "DatabaseMahasiswa"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "DatabaseMahasiswa_passportId_key" ON "DatabaseMahasiswa"("passportId");

-- CreateIndex
CREATE UNIQUE INDEX "DatabaseMahasiswa_ikametId_key" ON "DatabaseMahasiswa"("ikametId");
