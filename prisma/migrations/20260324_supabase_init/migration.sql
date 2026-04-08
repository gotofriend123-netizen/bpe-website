-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Space" AS ENUM ('vsl', 'vsr', 'arcade');

-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('available', 'pending', 'booked', 'blocked', 'cancelled', 'rescheduled', 'buffer_blocked', 'waitlist_only');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'pending_payment', 'confirmed', 'cancelled', 'rescheduled', 'completed', 'refund_initiated', 'refund_processed', 'no_show');

-- CreateEnum
CREATE TYPE "WaitlistStatus" AS ENUM ('active', 'notified', 'converted', 'closed');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('not_scheduled', 'pending', 'sent_72h', 'sent_24h', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilitySlot" (
    "id" TEXT NOT NULL,
    "space" "Space" NOT NULL,
    "dateKey" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "SlotStatus" NOT NULL DEFAULT 'available',
    "peakTime" BOOLEAN NOT NULL DEFAULT false,
    "priceModifier" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "label" TEXT,
    "bufferBefore" INTEGER NOT NULL DEFAULT 30,
    "bufferAfter" INTEGER NOT NULL DEFAULT 30,
    "note" TEXT,
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilitySlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT,
    "slotId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "space" "Space" NOT NULL,
    "dateKey" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "acceptedPolicies" BOOLEAN NOT NULL,
    "specificStudio" TEXT,
    "selectedPackage" TEXT,
    "packageLabel" TEXT,
    "priceModifier" DOUBLE PRECISION,
    "adminNotes" TEXT,
    "reminderStatus" "ReminderStatus" NOT NULL DEFAULT 'not_scheduled',
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rescheduledFromId" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingTag" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "bookingId" TEXT,
    "space" "Space" NOT NULL,
    "dateKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "note" TEXT,
    "status" "WaitlistStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "cancelFullRefundHours" INTEGER NOT NULL DEFAULT 72,
    "cancelPartialRefundHours" INTEGER NOT NULL DEFAULT 24,
    "partialRefundPercentage" INTEGER NOT NULL DEFAULT 50,
    "defaultBufferBefore" INTEGER NOT NULL DEFAULT 30,
    "defaultBufferAfter" INTEGER NOT NULL DEFAULT 30,
    "peakPricingMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.25,
    "whatsappNumber" TEXT,
    "reminderEmailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "reminderSmsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authUserId_key" ON "User"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AvailabilitySlot_space_dateKey_status_idx" ON "AvailabilitySlot"("space", "dateKey", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilitySlot_space_dateKey_startTime_endTime_key" ON "AvailabilitySlot"("space", "dateKey", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");

-- CreateIndex
CREATE INDEX "Booking_userId_createdAt_idx" ON "Booking"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_customerEmail_createdAt_idx" ON "Booking"("customerEmail", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_space_dateKey_status_idx" ON "Booking"("space", "dateKey", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BookingTag_bookingId_label_key" ON "BookingTag"("bookingId", "label");

-- CreateIndex
CREATE INDEX "WaitlistEntry_space_dateKey_status_idx" ON "WaitlistEntry"("space", "dateKey", "status");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "AvailabilitySlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_rescheduledFromId_fkey" FOREIGN KEY ("rescheduledFromId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingTag" ADD CONSTRAINT "BookingTag_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
