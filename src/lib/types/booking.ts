import type { BookingNotificationSummary } from "@/lib/notifications/types";

export type Space = 'vsl' | 'vsr' | 'arcade';

export type SlotStatus = 
  | 'available' 
  | 'pending' 
  | 'booked' 
  | 'blocked' 
  | 'cancelled' 
  | 'rescheduled' 
  | 'buffer-blocked' 
  | 'waitlist-only';

export type BookingStatus = 
  | 'confirmed' 
  | 'pending'
  | 'pending-payment'
  | 'cancelled' 
  | 'rescheduled'
  | 'completed'
  | 'refund-initiated'
  | 'refund-processed'
  | 'no-show';

export type ReminderStatus =
  | 'not_scheduled'
  | 'pending'
  | 'sent_72h'
  | 'sent_24h'
  | 'failed';

export interface TimeSlot {
  id: string;
  space: Space;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  status: SlotStatus;
  note?: string; // Admin internal note
  label?: string; // "Peak Time", "Weekend Rate", etc.
  isPeakTime: boolean;
  priceModifier?: number; // e.g., 1.5 for 50% increase
  bufferBefore?: number; // minutes
  bufferAfter?: number; // minutes
}

export interface Booking {
  id: string;
  reference: string;
  userId?: string;
  slotId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  space: Space;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  acceptedPolicies: boolean;
  createdAt: string; // ISO timestamp
  tags: string[]; // ['VIP', 'Urgent']
  adminNotes?: string;
  reminderStatus?: ReminderStatus;
  rescheduledFromId?: string;
  priceModifier?: number;
  packageLabel?: string;
  specificStudio?: string;
}

export interface WaitlistEntry {
  id: string;
  space: Space;
  date: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string; // ISO string
  note?: string;
  status?: 'active' | 'notified' | 'converted' | 'closed';
}

export interface PublicSlot {
  id: string;
  space: Space;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  peakTime: boolean;
  priceModifier: number;
  label?: string | null;
  bufferBefore: number;
  bufferAfter: number;
  note?: string | null;
  tag?: string | null;
}

export interface DayAvailabilitySummary {
  dateKey: string;
  totalSlots: number;
  availableSlots: number;
  pendingSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  waitlistOnlySlots: number;
  peakSlots: number;
  status: 'available' | 'limited' | 'fully-booked' | 'unavailable';
  nextAvailableSlot?: PublicSlot | null;
}

export interface PolicyEvaluation {
  action: 'cancel' | 'reschedule';
  hoursUntil: number;
  isAllowed: boolean;
  refundPercentage: number;
  message: string;
  shortMessage: string;
  policyTier: 'full' | 'partial' | 'locked' | 'no-show';
}

export interface BookingResponse {
  booking: Booking;
  policy: PolicyEvaluation;
  nextAvailableSlot: PublicSlot | null;
  manageUrl: string;
  confirmationUrl: string;
  notifications?: BookingNotificationSummary;
}

export interface BookingListResponse {
  bookings: Booking[];
  nextAvailableSlot?: PublicSlot | null;
}

export interface AvailabilityResponse {
  space: Space;
  month?: string;
  date?: string;
  days: DayAvailabilitySummary[];
  slots: PublicSlot[];
  nextAvailableSlot: PublicSlot | null;
  fullyBooked: boolean;
}

export interface PolicyRule {
  type: 'cancel' | 'reschedule';
  hoursBefore: number;
  isAllowed: boolean;
  refundPercentage?: number;
  message: string;
}
