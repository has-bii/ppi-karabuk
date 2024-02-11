/*
  Warnings:

  - You are about to drop the `DatabaseMahasiswa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DatabaseMahasiswa" DROP CONSTRAINT "DatabaseMahasiswa_userId_fkey";

-- DropTable
DROP TABLE "DatabaseMahasiswa";

-- CreateTable
CREATE TABLE "mahasiswa_databases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeBirth" VARCHAR(255) NOT NULL,
    "dateBirth" DATE NOT NULL,
    "wa" VARCHAR(255) NOT NULL,
    "telp" VARCHAR(255) NOT NULL,
    "domisili" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "tempatTinggal" "TempatTinggal" NOT NULL,
    "university" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "strata" "Pendidikan" NOT NULL,
    "tahunKedatangan" VARCHAR(4) NOT NULL,
    "studentId" VARCHAR(10) NOT NULL,
    "fileOgrenci" VARCHAR(255) NOT NULL,
    "passportId" VARCHAR(255) NOT NULL,
    "filePassport" VARCHAR(255) NOT NULL,
    "ikametId" VARCHAR(11) NOT NULL,
    "fileIkamet" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mahasiswa_databases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_databases_userId_key" ON "mahasiswa_databases"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_databases_studentId_key" ON "mahasiswa_databases"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_databases_passportId_key" ON "mahasiswa_databases"("passportId");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_databases_ikametId_key" ON "mahasiswa_databases"("ikametId");

-- AddForeignKey
ALTER TABLE "mahasiswa_databases" ADD CONSTRAINT "mahasiswa_databases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
