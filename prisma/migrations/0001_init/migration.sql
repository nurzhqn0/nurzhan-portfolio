CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "SiteProfile" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "headline" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "shortBio" TEXT NOT NULL,
  "longBio" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "resumeUrl" TEXT,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SiteProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "demoUrl" TEXT,
  "sourceUrl" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectImage" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "alt" TEXT NOT NULL,
  "caption" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Experience" (
  "id" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "location" TEXT,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "current" BOOLEAN NOT NULL DEFAULT false,
  "summary" TEXT NOT NULL,
  "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactLink" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "href" TEXT NOT NULL,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ContactLink_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE INDEX "Project_published_featured_sortOrder_idx" ON "Project"("published", "featured", "sortOrder");
CREATE INDEX "Project_slug_idx" ON "Project"("slug");
CREATE INDEX "ProjectImage_projectId_sortOrder_idx" ON "ProjectImage"("projectId", "sortOrder");
CREATE INDEX "Experience_published_sortOrder_idx" ON "Experience"("published", "sortOrder");
CREATE INDEX "ContactLink_visible_sortOrder_idx" ON "ContactLink"("visible", "sortOrder");

ALTER TABLE "ProjectImage"
ADD CONSTRAINT "ProjectImage_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
