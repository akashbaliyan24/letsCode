-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "public"."Problem" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL,
    "tags" TEXT[],
    "userId" TEXT NOT NULL,
    "examples" JSONB NOT NULL,
    "constraints" TEXT NOT NULL,
    "hints" TEXT,
    "editorial" TEXT,
    "testcases" JSONB NOT NULL,
    "codeSnippetsm" JSONB NOT NULL,
    "referenceSolution" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
