import { format, parseISO } from "date-fns";

import type { BookingNotificationTemplateInput } from "@/lib/notifications/types";

function formatDateLabel(dateKey: string) {
  return format(parseISO(dateKey), "EEEE, d MMMM yyyy");
}

function formatCreatedAt(value: string) {
  return format(new Date(value), "d MMM yyyy, h:mm a");
}

function renderOptionalLine(label: string, value?: string | null) {
  return value ? `${label}: ${value}` : null;
}

function renderPolicySummary(policySummary: string) {
  return `Policy summary: ${policySummary}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildAdminBookingAlertEmail(input: BookingNotificationTemplateInput) {
  const subject = `New booking alert: ${input.reference} · ${input.spaceLabel}`;
  const text = [
    "A new booking was saved successfully.",
    "",
    `Booking reference: ${input.reference}`,
    `Customer name: ${input.customerName}`,
    `Customer email: ${input.customerEmail}`,
    `Customer phone: ${input.customerPhone}`,
    `Booked space: ${input.spaceLabel}`,
    `Date: ${formatDateLabel(input.dateKey)}`,
    `Time: ${input.startTime} - ${input.endTime}`,
    `Booking status: ${input.statusLabel}`,
    renderOptionalLine("Booking package", input.packageLabel),
    renderOptionalLine("Customer notes", input.adminNotes),
    `Created at: ${formatCreatedAt(input.createdAt)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="background:#050505;padding:32px;font-family:ui-sans-serif,system-ui,sans-serif;color:#f5f5f5;">
      <div style="max-width:640px;margin:0 auto;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:28px;padding:32px;">
        <p style="letter-spacing:.28em;text-transform:uppercase;font-size:11px;color:#a1a1aa;margin:0 0 12px;">New booking alert</p>
        <h1 style="margin:0 0 18px;font-size:32px;line-height:1.1;">${escapeHtml(input.spaceLabel)} booking received</h1>
        <p style="margin:0 0 26px;color:#d4d4d8;">A new booking was saved successfully and is ready for the internal team to review.</p>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${[
              ["Booking reference", input.reference],
              ["Customer name", input.customerName],
              ["Customer email", input.customerEmail],
              ["Customer phone", input.customerPhone],
              ["Booked space", input.spaceLabel],
              ["Date", formatDateLabel(input.dateKey)],
              ["Time", `${input.startTime} - ${input.endTime}`],
              ["Booking status", input.statusLabel],
              ["Booking package", input.packageLabel],
              ["Customer notes", input.adminNotes],
              ["Created at", formatCreatedAt(input.createdAt)],
            ]
              .filter(([, value]) => Boolean(value))
              .map(
                ([label, value]) => `
                  <tr>
                    <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#71717a;vertical-align:top;">${escapeHtml(String(label))}</td>
                    <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:15px;color:#fafafa;text-align:right;">${escapeHtml(String(value))}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export function buildCustomerBookingConfirmationEmail(
  input: BookingNotificationTemplateInput,
) {
  const isConfirmed = input.statusLabel === "Confirmed";
  const subject = isConfirmed
    ? `Your booking is confirmed: ${input.reference}`
    : `Your booking request is in: ${input.reference}`;
  const statusLine = isConfirmed
    ? "Your session has been reserved successfully."
    : "Your booking request has been saved successfully and is now in our system.";

  const text = [
    `Hi ${input.customerName},`,
    "",
    statusLine,
    "",
    `Booking reference: ${input.reference}`,
    `Booked space: ${input.spaceLabel}`,
    `Date: ${formatDateLabel(input.dateKey)}`,
    `Time: ${input.startTime} - ${input.endTime}`,
    `Booking status: ${input.statusLabel}`,
    renderOptionalLine("Package", input.packageLabel),
    renderPolicySummary(input.policySummary),
    input.manageBookingUrl ? `Manage booking: ${input.manageBookingUrl}` : null,
    `Support email: ${input.supportEmail}`,
    `Support WhatsApp: ${input.supportWhatsappDisplay}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="background:#050505;padding:32px;font-family:ui-sans-serif,system-ui,sans-serif;color:#f5f5f5;">
      <div style="max-width:640px;margin:0 auto;background:linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02));border:1px solid rgba(255,255,255,0.08);border-radius:30px;padding:32px;">
        <p style="letter-spacing:.28em;text-transform:uppercase;font-size:11px;color:#a1a1aa;margin:0 0 14px;">Booking confirmation</p>
        <h1 style="margin:0 0 16px;font-size:30px;line-height:1.12;">Hi ${escapeHtml(input.customerName)}, your booking is in.</h1>
        <p style="margin:0 0 24px;color:#d4d4d8;font-size:16px;line-height:1.7;">${escapeHtml(statusLine)}</p>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:20px 22px;margin-bottom:22px;">
          <p style="margin:0 0 10px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#71717a;">Booking details</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Reference:</strong> ${escapeHtml(input.reference)}</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Space:</strong> ${escapeHtml(input.spaceLabel)}</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Date:</strong> ${escapeHtml(formatDateLabel(input.dateKey))}</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Time:</strong> ${escapeHtml(`${input.startTime} - ${input.endTime}`)}</p>
          <p style="margin:0;font-size:16px;"><strong>Status:</strong> ${escapeHtml(input.statusLabel)}</p>
        </div>
        <p style="margin:0 0 18px;color:#d4d4d8;font-size:15px;line-height:1.7;">${escapeHtml(renderPolicySummary(input.policySummary))}</p>
        ${
          input.manageBookingUrl
            ? `<p style="margin:0 0 18px;"><a href="${escapeHtml(input.manageBookingUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#ffffff;color:#050505;text-decoration:none;font-weight:700;">Manage booking</a></p>`
            : ""
        }
        <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:18px;color:#a1a1aa;font-size:14px;line-height:1.8;">
          <div>Support email: <span style="color:#fafafa;">${escapeHtml(input.supportEmail)}</span></div>
          <div>Support WhatsApp: <span style="color:#fafafa;">${escapeHtml(input.supportWhatsappDisplay)}</span></div>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export function buildCustomerBookingWhatsappMessage(
  input: BookingNotificationTemplateInput,
) {
  const openingLine =
    input.statusLabel === "Confirmed"
      ? `Hi ${input.customerName}, your booking is confirmed with ${input.reference}.`
      : `Hi ${input.customerName}, your booking request is in with ${input.reference}.`;

  return [
    openingLine,
    `${input.spaceLabel}`,
    `${formatDateLabel(input.dateKey)}`,
    `${input.startTime} - ${input.endTime}`,
    `Status: ${input.statusLabel}`,
    `Support: ${input.supportEmail} | WhatsApp ${input.supportWhatsappDisplay}`,
  ].join("\n");
}

export function buildAdminBookingWhatsappMessage(
  input: BookingNotificationTemplateInput,
) {
  return [
    `New booking alert: ${input.reference}`,
    `${input.customerName} · ${input.customerPhone}`,
    `${input.spaceLabel}`,
    `${formatDateLabel(input.dateKey)} · ${input.startTime} - ${input.endTime}`,
    `Status: ${input.statusLabel}`,
    input.packageLabel ? `Package: ${input.packageLabel}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
