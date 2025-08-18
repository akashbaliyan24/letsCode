/*
  Warnings:

  - You are about to drop the column `codeSnippetsm` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `referenceSolution` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `codeSnippets` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceSolutions` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Problem" DROP COLUMN "codeSnippetsm",
DROP COLUMN "referenceSolution",
ADD COLUMN     "codeSnippets" JSONB NOT NULL,
ADD COLUMN     "referenceSolutions" JSONB NOT NULL;
