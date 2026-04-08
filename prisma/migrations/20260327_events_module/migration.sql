-- CreateEnum
CREATE TYPE "EventBookingStatus" AS ENUM ('confirmed', 'cancelled', 'refunded');

-- CreateTable
CREATE TABLE "EventBooking" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT,
    "eventSlug" TEXT NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "eventCategory" TEXT NOT NULL,
    "eventVenue" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "posterImage" TEXT,
    "eventStartsAt" TIMESTAMP(3) NOT NULL,
    "eventEndsAt" TIMESTAMP(3),
    "ticketTierId" TEXT NOT NULL,
    "ticketTierLabel" TEXT NOT NULL,
    "ticketUnitPrice" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "notes" TEXT,
    "status" "EventBookingStatus" NOT NULL DEFAULT 'confirmed',
    "confirmationEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "adminEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "notificationFailedReason" TEXT,
    "notificationLastAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventBooking_reference_key" ON "EventBooking"("reference");

-- CreateIndex
CREATE INDEX "EventBooking_eventSlug_createdAt_idx" ON "EventBooking"("eventSlug", "createdAt");

-- CreateIndex
CREATE INDEX "EventBooking_customerEmail_createdAt_idx" ON "EventBooking"("customerEmail", "createdAt");

-- CreateIndex
CREATE INDEX "EventBooking_status_createdAt_idx" ON "EventBooking"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "EventBooking" ADD CONSTRAINT "EventBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
