/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId,commentId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_postId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Like_postId_userId_commentId_key" ON "Like"("postId", "userId", "commentId");
