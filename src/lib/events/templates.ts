import { format } from "date-fns";

type EventBookingTemplateInput = {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventTitle: string;
  eventCategory: string;
  venue: string;
  organizer: string;
  startsAt: Date;
  endsAt: Date;
  ticketTierLabel: string;
  quantity: number;
  totalAmount: number;
  confirmationUrl: string;
  supportEmail: string;
};

function formatDateTime(startsAt: Date, endsAt: Date) {
  return `${format(startsAt, "EEEE, d MMMM yyyy")} • ${format(startsAt, "h:mm a")} - ${format(endsAt, "h:mm a")}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildEventCustomerConfirmationEmail(input: EventBookingTemplateInput) {
  const subject = `Your event booking is confirmed: ${input.reference}`;
  const dateLine = formatDateTime(input.startsAt, input.endsAt);
  const text = [
    `Hi ${input.customerName},`,
    "",
    `Your booking for ${input.eventTitle} is confirmed.`,
    "",
    `Booking reference: ${input.reference}`,
    `Event: ${input.eventTitle}`,
    `Category: ${input.eventCategory}`,
    `Venue: ${input.venue}`,
    `Date & time: ${dateLine}`,
    `Ticket tier: ${input.ticketTierLabel}`,
    `Quantity: ${input.quantity}`,
    `Total: ${formatCurrency(input.totalAmount)}`,
    `Manage / confirmation: ${input.confirmationUrl}`,
    `Support email: ${input.supportEmail}`,
  ].join("\n");

  const html = `
    <div style="background:#050505;padding:32px;font-family:ui-sans-serif,system-ui,sans-serif;color:#f5f5f5;">
      <div style="max-width:640px;margin:0 auto;background:linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02));border:1px solid rgba(255,255,255,0.08);border-radius:30px;padding:32px;">
        <p style="letter-spacing:.28em;text-transform:uppercase;font-size:11px;color:#a1a1aa;margin:0 0 12px;">Event confirmation</p>
        <h1 style="margin:0 0 16px;font-size:30px;line-height:1.12;">${input.eventTitle} is booked.</h1>
        <p style="margin:0 0 22px;color:#d4d4d8;font-size:16px;line-height:1.7;">Hi ${input.customerName}, your event tickets are confirmed and your booking reference is ready below.</p>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:20px 22px;margin-bottom:22px;">
          <p style="margin:0 0 10px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#71717a;">Booking details</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Reference:</strong> ${input.reference}</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Event:</strong> ${input.eventTitle}</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Venue:</strong> ${input.venue}</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Date & time:</strong> ${dateLine}</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Ticket tier:</strong> ${input.ticketTierLabel}</p>
          <p style="margin:0 0 10px;font-size:16px;"><strong>Quantity:</strong> ${input.quantity}</p>
          <p style="margin:0;font-size:16px;"><strong>Total:</strong> ${formatCurrency(input.totalAmount)}</p>
        </div>
        <p style="margin:0 0 18px;"><a href="${input.confirmationUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#ffffff;color:#050505;text-decoration:none;font-weight:700;">View confirmation</a></p>
        <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:18px;color:#a1a1aa;font-size:14px;line-height:1.8;">
          <div>Organizer: <span style="color:#fafafa;">${input.organizer}</span></div>
          <div>Support email: <span style="color:#fafafa;">${input.supportEmail}</span></div>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export function buildEventAdminAlertEmail(input: EventBookingTemplateInput) {
  const subject = `New event booking: ${input.reference} · ${input.eventTitle}`;
  const dateLine = formatDateTime(input.startsAt, input.endsAt);
  const text = [
    "A new event booking was created.",
    "",
    `Reference: ${input.reference}`,
    `Customer: ${input.customerName}`,
    `Email: ${input.customerEmail}`,
    `Phone: ${input.customerPhone}`,
    `Event: ${input.eventTitle}`,
    `Category: ${input.eventCategory}`,
    `Venue: ${input.venue}`,
    `Organizer: ${input.organizer}`,
    `Date & time: ${dateLine}`,
    `Ticket tier: ${input.ticketTierLabel}`,
    `Quantity: ${input.quantity}`,
    `Total: ${formatCurrency(input.totalAmount)}`,
  ].join("\n");

  const html = `
    <div style="background:#050505;padding:32px;font-family:ui-sans-serif,system-ui,sans-serif;color:#f5f5f5;">
      <div style="max-width:640px;margin:0 auto;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:28px;padding:32px;">
        <p style="letter-spacing:.28em;text-transform:uppercase;font-size:11px;color:#a1a1aa;margin:0 0 12px;">New event booking</p>
        <h1 style="margin:0 0 18px;font-size:32px;line-height:1.1;">${input.eventTitle}</h1>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${[
              ["Reference", input.reference],
              ["Customer", input.customerName],
              ["Email", input.customerEmail],
              ["Phone", input.customerPhone],
              ["Category", input.eventCategory],
              ["Venue", input.venue],
              ["Organizer", input.organizer],
              ["Date & time", dateLine],
              ["Ticket tier", input.ticketTierLabel],
              ["Quantity", String(input.quantity)],
              ["Total", formatCurrency(input.totalAmount)],
            ]
              .map(
                ([label, value]) => `
                  <tr>
                    <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#71717a;vertical-align:top;">${label}</td>
                    <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:15px;color:#fafafa;text-align:right;">${value}</td>
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
