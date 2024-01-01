-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('AUTH', 'FORGOT', 'VERIFY');

-- CreateEnum
CREATE TYPE "NavListType" AS ENUM ('DROPDOWN', 'ITEM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "studentId" VARCHAR(10) NOT NULL,
    "kimlikId" VARCHAR(11) NOT NULL,
    "role" "Role"[] DEFAULT ARRAY['USER']::"Role"[],
    "isVerified" TIMESTAMP(3),
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "img" VARCHAR(255),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "expireDate" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verify_requests" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "img" TEXT NOT NULL,

    CONSTRAINT "verify_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_lists" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "type" "NavListType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "url" VARCHAR(255),
    "navlistId" INTEGER,

    CONSTRAINT "nav_lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_studentId_key" ON "users"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "users_kimlikId_key" ON "users"("kimlikId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_studentId_kimlikId_key" ON "users"("email", "studentId", "kimlikId");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_value_key" ON "tokens"("value");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verify_requests" ADD CONSTRAINT "verify_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nav_lists" ADD CONSTRAINT "nav_lists_navlistId_fkey" FOREIGN KEY ("navlistId") REFERENCES "nav_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
