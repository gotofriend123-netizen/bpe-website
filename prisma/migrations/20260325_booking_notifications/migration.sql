ALTER TABLE "Booking"
ADD COLUMN "adminEmailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "customerEmailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "customerWhatsappSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "adminWhatsappSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "notificationFailedReason" TEXT,
ADD COLUMN "notificationLastAttemptAt" TIMESTAMP(3);

ALTER TABLE "AppSettings"
ALTER COLUMN "whatsappNumber" DROP DEFAULT;
