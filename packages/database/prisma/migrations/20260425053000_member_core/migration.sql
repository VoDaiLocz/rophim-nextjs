CREATE TABLE IF NOT EXISTS "Movie" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "posterUrl" TEXT,
  "backdropUrl" TEXT,
  "releaseYear" INTEGER,
  "imdbRating" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Favorite" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "movieSlug" TEXT NOT NULL,
  "movieTitle" TEXT NOT NULL,
  "posterUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Comment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "movieSlug" TEXT NOT NULL,
  "movieTitle" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Rating" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "movieSlug" TEXT NOT NULL,
  "movieTitle" TEXT NOT NULL,
  "value" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "WatchHistory" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "movieSlug" TEXT NOT NULL,
  "movieTitle" TEXT NOT NULL,
  "posterUrl" TEXT,
  "episodeName" TEXT NOT NULL,
  "progressSeconds" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WatchHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Movie_slug_key" ON "Movie"("slug");
CREATE INDEX IF NOT EXISTS "Movie_slug_idx" ON "Movie"("slug");

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE UNIQUE INDEX IF NOT EXISTS "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session"("expiresAt");

CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_movieSlug_key" ON "Favorite"("userId", "movieSlug");
CREATE INDEX IF NOT EXISTS "Favorite_movieSlug_idx" ON "Favorite"("movieSlug");

CREATE INDEX IF NOT EXISTS "Comment_movieSlug_createdAt_idx" ON "Comment"("movieSlug", "createdAt");
CREATE INDEX IF NOT EXISTS "Comment_userId_idx" ON "Comment"("userId");

CREATE UNIQUE INDEX IF NOT EXISTS "Rating_userId_movieSlug_key" ON "Rating"("userId", "movieSlug");
CREATE INDEX IF NOT EXISTS "Rating_movieSlug_idx" ON "Rating"("movieSlug");

CREATE UNIQUE INDEX IF NOT EXISTS "WatchHistory_userId_movieSlug_episodeName_key" ON "WatchHistory"("userId", "movieSlug", "episodeName");
CREATE INDEX IF NOT EXISTS "WatchHistory_userId_updatedAt_idx" ON "WatchHistory"("userId", "updatedAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Session_userId_fkey'
  ) THEN
    ALTER TABLE "Session"
    ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Favorite_userId_fkey'
  ) THEN
    ALTER TABLE "Favorite"
    ADD CONSTRAINT "Favorite_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Comment_userId_fkey'
  ) THEN
    ALTER TABLE "Comment"
    ADD CONSTRAINT "Comment_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Rating_userId_fkey'
  ) THEN
    ALTER TABLE "Rating"
    ADD CONSTRAINT "Rating_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'WatchHistory_userId_fkey'
  ) THEN
    ALTER TABLE "WatchHistory"
    ADD CONSTRAINT "WatchHistory_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
