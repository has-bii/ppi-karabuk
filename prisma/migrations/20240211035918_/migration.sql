/*
  Warnings:

  - You are about to drop the column `dateBirth` on the `mahasiswa_databases` table. All the data in the column will be lost.
  - You are about to drop the column `placeBirth` on the `mahasiswa_databases` table. All the data in the column will be lost.
  - Added the required column `birthDate` to the `mahasiswa_databases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthPlace` to the `mahasiswa_databases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mahasiswa_databases" DROP COLUMN "dateBirth",
DROP COLUMN "placeBirth",
ADD COLUMN     "birthDate" DATE NOT NULL,
ADD COLUMN     "birthPlace" VARCHAR(255) NOT NULL;
