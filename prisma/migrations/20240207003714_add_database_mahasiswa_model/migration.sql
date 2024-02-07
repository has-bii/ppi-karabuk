-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "TempatTinggal" AS ENUM ('APPARTEMENT', 'DORMITORY');

-- CreateEnum
CREATE TYPE "Pendidikan" AS ENUM ('TOMER', 'S1', 'S2', 'S3');

-- CreateTable
CREATE TABLE "DatabaseMahasiswa" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "TTL" DATE NOT NULL,
    "wa" VARCHAR(255) NOT NULL,
    "telp" VARCHAR(255) NOT NULL,
    "domisili" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "tempatTinggal" "TempatTinggal" NOT NULL,
    "university" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "strata" "Pendidikan" NOT NULL,
    "tahunKedatangan" VARCHAR(4) NOT NULL,
    "fileOgrenci" VARCHAR(255) NOT NULL,
    "noPaspor" VARCHAR(255) NOT NULL,
    "filePaspor" VARCHAR(255) NOT NULL,
    "fileIkamet" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "DatabaseMahasiswa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DatabaseMahasiswa" ADD CONSTRAINT "DatabaseMahasiswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
