/*
  Warnings:

  - You are about to drop the `verify_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "verify_requests" DROP CONSTRAINT "verify_requests_userId_fkey";

-- DropTable
DROP TABLE "verify_requests";

-- CreateTable
CREATE TABLE "activation_requests" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "img" TEXT NOT NULL,

    CONSTRAINT "activation_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activation_requests" ADD CONSTRAINT "activation_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
