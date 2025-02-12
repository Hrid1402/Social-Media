-- CreateTable
CREATE TABLE "Follower" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followingUserId" TEXT NOT NULL,
    "followedUserId" TEXT NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("followingUserId","followedUserId")
);

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followedUserId_fkey" FOREIGN KEY ("followedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followingUserId_fkey" FOREIGN KEY ("followingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
