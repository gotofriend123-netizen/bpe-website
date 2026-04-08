import "server-only";

import { getTwilioConfig } from "@/lib/notifications/config";

type WhatsappInput = {
  to: string;
  body: string;
};

export async function sendWhatsappMessage(input: WhatsappInput) {
  const config = getTwilioConfig();

  if (!config) {
    return {
      ok: false as const,
      kind: "not-configured" as const,
      reason: "Twilio WhatsApp delivery is not configured in environment variables.",
    };
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          From: config.from,
          To: input.to,
          Body: input.body,
        }).toString(),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      let reason = `Twilio request failed with ${response.status}.`;

      try {
        const payload = (await response.json()) as { message?: string };
        if (payload.message) {
          reason = payload.message;
        }
      } catch {
        // Keep the generic reason if the response body is not JSON.
      }

      return {
        ok: false as const,
        kind: "error" as const,
        reason,
      };
    }

    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      kind: "error" as const,
      reason: error instanceof Error ? error.message : "Unknown WhatsApp delivery error.",
    };
  }
}
