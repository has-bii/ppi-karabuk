-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'STUDENT';

-- AlterTable
ALTER TABLE "nav_lists" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
