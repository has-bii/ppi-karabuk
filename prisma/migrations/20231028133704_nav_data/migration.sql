/*
  Warnings:

  - A unique constraint covering the columns `[email,studentId,kimlikId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NavListType" AS ENUM ('DROPDOWN', 'ITEM');

-- CreateTable
CREATE TABLE "nav_lists" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "NavListType" NOT NULL DEFAULT 'ITEM',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "url" VARCHAR(255),

    CONSTRAINT "nav_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_items" (
    "id" SERIAL NOT NULL,
    "navId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "nav_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_studentId_kimlikId_key" ON "users"("email", "studentId", "kimlikId");

-- AddForeignKey
ALTER TABLE "nav_items" ADD CONSTRAINT "nav_items_navId_fkey" FOREIGN KEY ("navId") REFERENCES "nav_lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
