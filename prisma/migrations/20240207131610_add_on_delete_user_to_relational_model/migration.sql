-- DropForeignKey
ALTER TABLE "DatabaseMahasiswa" DROP CONSTRAINT "DatabaseMahasiswa_userId_fkey";

-- DropForeignKey
ALTER TABLE "activation_requests" DROP CONSTRAINT "activation_requests_userId_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activation_requests" ADD CONSTRAINT "activation_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatabaseMahasiswa" ADD CONSTRAINT "DatabaseMahasiswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
