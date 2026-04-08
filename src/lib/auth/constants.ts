export const DEFAULT_AUTH_REDIRECT = "/dashboard";
export const DEFAULT_ADMIN_REDIRECT = "/admin";

const DEFAULT_ADMIN_EMAILS = [
  "adityasingh808589@gmail.com",
  "gotofriend123@gmail.com",
] as const;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function parseConfiguredAdminEmails(rawValue?: string | null) {
  const configured = (rawValue ?? "")
    .split(",")
    .map((value) => normalizeEmail(value))
    .filter(Boolean);

  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...configured].map(normalizeEmail)));
}

export const ADMIN_EMAILS = parseConfiguredAdminEmails(process.env.ADMIN_EMAILS);
export const ADMIN_EMAIL_SET = new Set(ADMIN_EMAILS);

export function isConfiguredAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return ADMIN_EMAIL_SET.has(normalizeEmail(email));
}
