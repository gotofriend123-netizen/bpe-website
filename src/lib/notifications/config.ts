import { BUSINESS_NAME, BUSINESS_SUPPORT_EMAIL } from "@/lib/business/contact";

type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

type TwilioConfig = {
  accountSid: string;
  authToken: string;
  from: string;
  sandboxMode: boolean;
  adminAlertTo: string | null;
};

export function getMailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST;
  const portValue = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !portValue || !user || !pass) {
    return null;
  }

  const port = Number(portValue);

  if (!Number.isFinite(port)) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from:
      process.env.MAIL_FROM ||
      `${BUSINESS_NAME} <${process.env.SMTP_USER || BUSINESS_SUPPORT_EMAIL}>`,
  };
}

export function getTwilioConfig(): TwilioConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    return null;
  }

  return {
    accountSid,
    authToken,
    from,
    sandboxMode: process.env.TWILIO_SANDBOX_MODE !== "false",
    adminAlertTo: process.env.TWILIO_ADMIN_WHATSAPP_TO || null,
  };
}
