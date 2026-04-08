export type NotificationChannelState = "sent" | "failed" | "skipped";

export type BookingNotificationSummary = {
  adminEmail: NotificationChannelState;
  customerEmail: NotificationChannelState;
  customerWhatsapp: NotificationChannelState;
  adminWhatsapp: NotificationChannelState;
  lastAttemptAt: string | null;
  failedReason: string | null;
};

export type BookingNotificationTemplateInput = {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  spaceLabel: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  statusLabel: string;
  packageLabel?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  manageBookingUrl?: string;
  supportEmail: string;
  supportWhatsappDisplay: string;
  policySummary: string;
};
