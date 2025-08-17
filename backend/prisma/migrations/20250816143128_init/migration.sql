-- CreateTable
CREATE TABLE "public"."Search" (
    "id" SERIAL NOT NULL,
    "kind" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "trackName" TEXT NOT NULL,
    "trackTimeMillis" INTEGER NOT NULL,
    "artworkUrl100" TEXT NOT NULL,
    "previewUrl" TEXT NOT NULL,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);
