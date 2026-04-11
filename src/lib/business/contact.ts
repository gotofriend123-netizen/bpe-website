const DEFAULT_APP_URL = "http://localhost:3000";

export const BUSINESS_NAME = "Black Pepper Entertainment";
export const BUSINESS_SUPPORT_EMAIL = "blackpepperentertainment.in@gmail.com";
export const BUSINESS_SUPPORT_WHATSAPP_DISPLAY = "+91 92034 11611";
export const BUSINESS_SUPPORT_WHATSAPP_E164 = "+919203411611";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getAppBaseUrl() {
  const configured =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_APP_URL;

  return trimTrailingSlash(configured);
}

export function toAbsoluteAppUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppBaseUrl()}${normalizedPath}`;
}

export function getBusinessSupportWhatsappLink() {
  return `https://wa.me/${BUSINESS_SUPPORT_WHATSAPP_E164.replace(/\D/g, "")}`;
}

export function formatBusinessSupportContact(overrideWhatsappNumber?: string | null) {
  return {
    email: BUSINESS_SUPPORT_EMAIL,
    whatsappDisplay: overrideWhatsappNumber || BUSINESS_SUPPORT_WHATSAPP_DISPLAY,
    whatsappE164: BUSINESS_SUPPORT_WHATSAPP_E164,
    whatsappLink: getBusinessSupportWhatsappLink(),
  };
}

export function normalizePhoneNumber(input: string) {
  const sanitized = input.replace(/[^\d+]/g, "");

  if (!sanitized) {
    return null;
  }

  if (sanitized.startsWith("+")) {
    return sanitized;
  }

  const digits = sanitized.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (digits.length > 10) {
    return `+${digits}`;
  }

  return null;
}

export function toWhatsappRecipient(input: string) {
  const phone = normalizePhoneNumber(input);
  return phone ? `whatsapp:${phone}` : null;
}
