/*
  Warnings:

  - You are about to drop the column `filePaspor` on the `DatabaseMahasiswa` table. All the data in the column will be lost.
  - Added the required column `filePassport` to the `DatabaseMahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DatabaseMahasiswa" DROP COLUMN "filePaspor",
ADD COLUMN     "filePassport" VARCHAR(255) NOT NULL;
