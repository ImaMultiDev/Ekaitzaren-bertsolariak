-- Eliminar obras POEM y OTHER (y sus relaciones en cascada)
DELETE FROM "WorkTag" WHERE "workId" IN (SELECT "id" FROM "Work" WHERE "type" IN ('POEM', 'OTHER'));
DELETE FROM "WorkImage" WHERE "workId" IN (SELECT "id" FROM "Work" WHERE "type" IN ('POEM', 'OTHER'));
DELETE FROM "Song" WHERE "workId" IN (SELECT "id" FROM "Work" WHERE "type" IN ('POEM', 'OTHER'));
DELETE FROM "Book" WHERE "workId" IN (SELECT "id" FROM "Work" WHERE "type" IN ('POEM', 'OTHER'));
DELETE FROM "Work" WHERE "type" IN ('POEM', 'OTHER');

-- CreateTable Project
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "year" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- AlterTable Work: add projectId
ALTER TABLE "Work" ADD COLUMN "projectId" TEXT;

-- CreateEnum WorkType_new (solo SONG, BOOK)
CREATE TYPE "WorkType_new" AS ENUM ('SONG', 'BOOK');

-- AlterTable Work: cambiar tipo de columna
ALTER TABLE "Work" ALTER COLUMN "type" TYPE "WorkType_new" USING ("type"::text::"WorkType_new");

-- Drop old enum and rename
DROP TYPE "WorkType";
ALTER TYPE "WorkType_new" RENAME TO "WorkType";

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
