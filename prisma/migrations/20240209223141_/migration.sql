/*
  Warnings:

  - You are about to drop the column `TTL` on the `DatabaseMahasiswa` table. All the data in the column will be lost.
  - Added the required column `dateBirth` to the `DatabaseMahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placeBirth` to the `DatabaseMahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DatabaseMahasiswa" DROP COLUMN "TTL",
ADD COLUMN     "dateBirth" DATE NOT NULL,
ADD COLUMN     "placeBirth" VARCHAR(255) NOT NULL;
