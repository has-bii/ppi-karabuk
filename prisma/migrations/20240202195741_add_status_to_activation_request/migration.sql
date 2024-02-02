/*
  Warnings:

  - Added the required column `status` to the `activation_requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivationRequestStatus" AS ENUM ('PENDING', 'REJECTED', 'APPROVED');

-- AlterTable
ALTER TABLE "activation_requests" ADD COLUMN     "status" "ActivationRequestStatus" NOT NULL;
