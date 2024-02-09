/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `DatabaseMahasiswa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DatabaseMahasiswa_userId_key" ON "DatabaseMahasiswa"("userId");
