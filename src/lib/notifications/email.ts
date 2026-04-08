import "server-only";

import nodemailer from "nodemailer";

import { getMailConfig } from "@/lib/notifications/config";

type MailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendMail(input: MailInput) {
  const config = getMailConfig();

  if (!config) {
    return {
      ok: false as const,
      kind: "not-configured" as const,
      reason: "Email delivery is not configured in environment variables.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  try {
    await transporter.sendMail({
      from: config.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      kind: "error" as const,
      reason: error instanceof Error ? error.message : "Unknown email delivery error.",
    };
  }
}
