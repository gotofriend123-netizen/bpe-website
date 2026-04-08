-- CreateEnum
CREATE TYPE "EventAvailability" AS ENUM ('available', 'limited', 'sold_out');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('draft', 'active', 'expired', 'archived');

-- CreateTable
CREATE TABLE "EventListing" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT,
    "category" TEXT NOT NULL,
    "categoryLabel" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "teaser" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Raipur',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "availability" "EventAvailability" NOT NULL DEFAULT 'available',
    "priceFrom" INTEGER NOT NULL,
    "posterImage" TEXT NOT NULL,
    "coverImage" TEXT,
    "accent" TEXT,
    "metadataLine" TEXT,
    "highlights" JSONB,
    "description" JSONB,
    "faq" JSONB,
    "policies" JSONB,
    "ticketTiers" JSONB,
    "hot" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "homepage" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "accent" TEXT,
    "venue" TEXT,
    "code" TEXT,
    "discountLabel" TEXT,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Claim Offer',
    "status" "OfferStatus" NOT NULL DEFAULT 'active',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "validUntil" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventListing_slug_key" ON "EventListing"("slug");

-- CreateIndex
CREATE INDEX "EventListing_published_startsAt_idx" ON "EventListing"("published", "startsAt");

-- CreateIndex
CREATE INDEX "EventListing_category_startsAt_idx" ON "EventListing"("category", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_slug_key" ON "Offer"("slug");

-- CreateIndex
CREATE INDEX "Offer_status_createdAt_idx" ON "Offer"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Offer_featured_status_idx" ON "Offer"("featured", "status");

-- AddForeignKey
ALTER TABLE "EventListing" ADD CONSTRAINT "EventListing_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
