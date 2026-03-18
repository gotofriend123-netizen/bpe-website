import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { bookingFormSchema } from "@/lib/validations";
import { CONFIG, BOOKING_TYPES, SPECIFIC_STUDIOS } from "@/config/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("=== API /book HIT ===");
    console.log("Incoming Payload:", body);

    // 1. Zod Validation
    const parsed = bookingFormSchema.safeParse({
      ...body,
      date: body.date ? new Date(body.date) : undefined,
    });

    if (!parsed.success) {
      console.error("Zod Validation Error:", parsed.error.issues);
      return NextResponse.json(
        { message: "Invalid form data.", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Human readable mappings
    const bookingTypeLabel =
      BOOKING_TYPES.find((b) => b.id === data.bookingType)?.label || "Unknown";
    const specificStudioItem = SPECIFIC_STUDIOS.find((s) => s.id === data.specificStudio);
    const specificStudioLabel = data.specificStudio
      ? specificStudioItem?.name || "Unknown"
      : "N/A";

    const selectedPackageItem = data.selectedPackageId
      ? specificStudioItem?.packages.find((p) => p.id === data.selectedPackageId)
      : null;

    const packageLabel = selectedPackageItem
      ? `${selectedPackageItem.name} (${selectedPackageItem.pricePreview})`
      : "N/A";

    const dateFormatted = data.date ? new Date(data.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) : "Invalid Date";

    // 2. Email Transporter Setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Admin Email
    const adminHtml = `
      <h2>New Booking Request</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Phone:</strong> ${data.phoneNumber}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Booking Type:</strong> ${bookingTypeLabel}</p>
      <p><strong>Specific Studio:</strong> ${specificStudioLabel}</p>
      <p><strong>Selected Package:</strong> ${packageLabel}</p>
      <p><strong>Date:</strong> ${dateFormatted}</p>
      <p><strong>Time:</strong> ${data.time}</p>
    `;

    const adminMailOptions = {
      from: `"${CONFIG.senderName}" <${process.env.EMAIL_USER}>`,
      to: CONFIG.adminEmail,
      subject: `New Booking Request: ${data.fullName} - ${bookingTypeLabel}`,
      html: adminHtml,
    };

    // 4. Customer Email
    const customerHtml = `
      <h3>Hi ${data.fullName},</h3>
      <p>Thank you for submitting your booking request at Verve Studio.</p>
      <p><strong>Details of your request:</strong></p>
      <ul>
        <li><strong>Booking Type:</strong> ${bookingTypeLabel}</li>
        <li><strong>Specific Studio:</strong> ${specificStudioLabel}</li>
        <li><strong>Selected Package:</strong> ${packageLabel}</li>
        <li><strong>Date:</strong> ${dateFormatted}</li>
        <li><strong>Time:</strong> ${data.time}</li>
      </ul>
      <p>Our team will contact you shortly to confirm your booking and process payment.</p>
      <br />
      <p>Best regards,</p>
      <p>${CONFIG.senderName}</p>
    `;

    const customerMailOptions = {
      from: `"${CONFIG.senderName}" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "We received your Verve Studio booking request",
      html: customerHtml,
    };

    // 5. Send Emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    return NextResponse.json(
      { message: "Booking submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json(
      { message: "Failed to submit booking. Please try again later." },
      { status: 500 }
    );
  }
}
