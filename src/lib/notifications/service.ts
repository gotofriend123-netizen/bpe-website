import "server-only";

import { BookingStatus, Prisma } from "@prisma/client";

import {
  BUSINESS_SUPPORT_WHATSAPP_DISPLAY,
  formatBusinessSupportContact,
  toAbsoluteAppUrl,
  toWhatsappRecipient,
} from "@/lib/business/contact";
import { prisma } from "@/lib/prisma";
import { SPACE_LABELS } from "@/lib/booking-utils";
import { sendMail } from "@/lib/notifications/email";
import {
  buildAdminBookingAlertEmail,
  buildAdminBookingWhatsappMessage,
  buildCustomerBookingConfirmationEmail,
  buildCustomerBookingWhatsappMessage,
} from "@/lib/notifications/templates";
import type {
  BookingNotificationSummary,
  BookingNotificationTemplateInput,
  NotificationChannelState,
} from "@/lib/notifications/types";
import { sendWhatsappMessage } from "@/lib/notifications/whatsapp";

type BookingWithNotificationState = Prisma.BookingGetPayload<{
  include: {
    user: true;
  };
}>;

function getStatusLabel(status: BookingStatus) {
  switch (status) {
    case BookingStatus.confirmed:
      return "Confirmed";
    case BookingStatus.pending:
      return "Pending";
    case BookingStatus.pending_payment:
      return "Pending Payment";
    case BookingStatus.cancelled:
      return "Cancelled";
    case BookingStatus.rescheduled:
      return "Rescheduled";
    case BookingStatus.completed:
      return "Completed";
    case BookingStatus.refund_initiated:
      return "Refund Initiated";
    case BookingStatus.refund_processed:
      return "Refund Processed";
    case BookingStatus.no_show:
      return "No Show";
    default:
      return "Pending";
  }
}

function buildPolicySummary(settings: {
  cancelFullRefundHours: number;
  cancelPartialRefundHours: number;
  partialRefundPercentage: number;
} | null) {
  const fullHours = settings?.cancelFullRefundHours ?? 72;
  const partialHours = settings?.cancelPartialRefundHours ?? 24;
  const partialPercent = settings?.partialRefundPercentage ?? 50;

  return `Changes more than ${fullHours} hours before the slot remain eligible for cancellation or rescheduling support. Between ${partialHours} and ${fullHours} hours, rescheduling remains available and partial refunds may apply (${partialPercent}%). Under ${partialHours} hours, changes may be restricted by policy.`;
}

function createSkippedSummary(): BookingNotificationSummary {
  return {
    adminEmail: "skipped",
    customerEmail: "skipped",
    customerWhatsapp: "skipped",
    adminWhatsapp: "skipped",
    lastAttemptAt: null,
    failedReason: null,
  };
}

function buildTemplateInput(params: {
  booking: BookingWithNotificationState;
  supportWhatsappNumber: string | null;
  manageUrl: string;
  policySummary: string;
}): BookingNotificationTemplateInput {
  const { booking, supportWhatsappNumber, manageUrl, policySummary } = params;
  const support = formatBusinessSupportContact(supportWhatsappNumber);

  return {
    reference: booking.reference,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    spaceLabel: SPACE_LABELS[booking.space],
    dateKey: booking.dateKey,
    startTime: booking.startTime,
    endTime: booking.endTime,
    statusLabel: getStatusLabel(booking.status),
    packageLabel: booking.packageLabel,
    adminNotes: booking.adminNotes,
    createdAt: booking.createdAt.toISOString(),
    manageBookingUrl: toAbsoluteAppUrl(manageUrl),
    supportEmail: support.email,
    supportWhatsappDisplay: support.whatsappDisplay,
    policySummary,
  };
}

function normalizeChannelResult(
  currentSent: boolean,
  result:
    | { ok: true }
    | { ok: false; kind: "error" | "not-configured"; reason: string },
): {
  state: NotificationChannelState;
  reason: string | null;
  sent: boolean;
} {
  if (currentSent) {
    return {
      state: "skipped",
      reason: null,
      sent: true,
    };
  }

  if (result.ok) {
    return {
      state: "sent",
      reason: null,
      sent: true,
    };
  }

  return {
      state: result.kind === "not-configured" ? "skipped" : "failed",
      reason: result.kind === "error" ? result.reason : null,
      sent: false,
    };
}

function getNotificationErrorReason(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown notification failure.";
}

async function runNotificationChannel(
  operation: () => Promise<
    | { ok: true }
    | { ok: false; kind: "error" | "not-configured"; reason: string }
  >,
) {
  try {
    return await operation();
  } catch (error) {
    return {
      ok: false as const,
      kind: "error" as const,
      reason: getNotificationErrorReason(error),
    };
  }
}

export async function recordBookingNotificationFailure(params: {
  bookingId: string;
  reason: string;
}) {
  try {
    await prisma.booking.update({
      where: { id: params.bookingId },
      data: {
        notificationLastAttemptAt: new Date(),
        notificationFailedReason: params.reason.slice(0, 1800),
      },
    });
  } catch (error) {
    const reason = getNotificationErrorReason(error);
    console.error(
      `[booking-notifications] Failed to persist notification error state for ${params.bookingId}: ${reason}`,
    );
  }
}

export async function sendBookingNotifications(params: {
  bookingId: string;
  manageUrl: string;
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: { user: true },
  });

  if (!booking) {
    return createSkippedSummary();
  }

  const settings = await prisma.appSettings.findUnique({
    where: { id: 1 },
    select: {
      cancelFullRefundHours: true,
      cancelPartialRefundHours: true,
      partialRefundPercentage: true,
      whatsappNumber: true,
    },
  });

  const policySummary = buildPolicySummary(settings);
  const templateInput = buildTemplateInput({
    booking,
    supportWhatsappNumber: settings?.whatsappNumber ?? BUSINESS_SUPPORT_WHATSAPP_DISPLAY,
    manageUrl: params.manageUrl,
    policySummary,
  });

  const adminEmailResult = normalizeChannelResult(
    booking.adminEmailSent,
    booking.adminEmailSent
      ? { ok: true as const }
      : await runNotificationChannel(() =>
          sendMail({
            to: templateInput.supportEmail,
            ...buildAdminBookingAlertEmail(templateInput),
          }),
        ),
  );

  const customerEmailResult = normalizeChannelResult(
    booking.customerEmailSent,
    booking.customerEmailSent
      ? { ok: true as const }
      : await runNotificationChannel(() =>
          sendMail({
            to: booking.customerEmail,
            ...buildCustomerBookingConfirmationEmail(templateInput),
          }),
        ),
  );

  const customerWhatsappRecipient = toWhatsappRecipient(booking.customerPhone);
  const customerWhatsappResult = normalizeChannelResult(
    booking.customerWhatsappSent,
    booking.customerWhatsappSent
      ? { ok: true as const }
      : customerWhatsappRecipient
        ? await runNotificationChannel(() =>
            sendWhatsappMessage({
              to: customerWhatsappRecipient,
              body: buildCustomerBookingWhatsappMessage(templateInput),
            }),
          )
        : {
            ok: false as const,
            kind: "error" as const,
            reason: "Customer phone number is not valid for WhatsApp delivery.",
          },
  );

  const adminWhatsappRecipient = toWhatsappRecipient(
    process.env.TWILIO_ADMIN_WHATSAPP_TO || settings?.whatsappNumber || "",
  );
  const adminWhatsappResult = normalizeChannelResult(
    booking.adminWhatsappSent,
    booking.adminWhatsappSent
      ? { ok: true as const }
      : adminWhatsappRecipient
        ? await runNotificationChannel(() =>
            sendWhatsappMessage({
              to: adminWhatsappRecipient,
              body: buildAdminBookingWhatsappMessage(templateInput),
            }),
          )
        : {
            ok: false as const,
            kind: "not-configured" as const,
            reason: "Admin WhatsApp alert recipient is not configured.",
          },
  );

  const lastAttemptAt = new Date();
  const failureReason = [
    adminEmailResult.reason ? `Admin email: ${adminEmailResult.reason}` : null,
    customerEmailResult.reason ? `Customer email: ${customerEmailResult.reason}` : null,
    customerWhatsappResult.reason ? `Customer WhatsApp: ${customerWhatsappResult.reason}` : null,
    adminWhatsappResult.reason ? `Admin WhatsApp: ${adminWhatsappResult.reason}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      adminEmailSent: booking.adminEmailSent || adminEmailResult.sent,
      customerEmailSent: booking.customerEmailSent || customerEmailResult.sent,
      customerWhatsappSent: booking.customerWhatsappSent || customerWhatsappResult.sent,
      adminWhatsappSent: booking.adminWhatsappSent || adminWhatsappResult.sent,
      notificationLastAttemptAt: lastAttemptAt,
      notificationFailedReason: failureReason || null,
    },
  });

  if (failureReason) {
    console.error(
      `[booking-notifications] Partial delivery failure for ${booking.reference}: ${failureReason}`,
    );
  }

  return {
    adminEmail: adminEmailResult.state,
    customerEmail: customerEmailResult.state,
    customerWhatsapp: customerWhatsappResult.state,
    adminWhatsapp: adminWhatsappResult.state,
    lastAttemptAt: lastAttemptAt.toISOString(),
    failedReason: failureReason || null,
  } satisfies BookingNotificationSummary;
}
