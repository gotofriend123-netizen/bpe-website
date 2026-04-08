import type { PolicyEvaluation } from "@/lib/types/booking";
import { getHoursUntil } from "./time";

export interface PolicySettings {
  fullRefundHours: number;
  partialRefundHours: number;
  partialRefundPercentage: number;
}

export const DEFAULT_POLICY_SETTINGS: PolicySettings = {
  fullRefundHours: 72,
  partialRefundHours: 24,
  partialRefundPercentage: 50,
};

export function evaluatePolicy(
  action: "cancel" | "reschedule",
  dateKey: string,
  startTime: string,
  settings: PolicySettings = DEFAULT_POLICY_SETTINGS,
  now = new Date(),
): PolicyEvaluation {
  const hoursUntil = getHoursUntil(dateKey, startTime, now);

  if (hoursUntil > settings.fullRefundHours) {
    return {
      action,
      hoursUntil,
      isAllowed: true,
      refundPercentage: 100,
      policyTier: "full",
      shortMessage: "Full flexibility",
      message:
        "More than 72 hours remain, so this booking is eligible for full cancellation or rescheduling support.",
    };
  }

  if (hoursUntil >= settings.partialRefundHours) {
    return {
      action,
      hoursUntil,
      isAllowed: true,
      refundPercentage: settings.partialRefundPercentage,
      policyTier: "partial",
      shortMessage: "Partial flexibility",
      message:
        "Between 24 and 72 hours remain, so this booking is eligible for rescheduling and a partial refund placeholder.",
    };
  }

  if (hoursUntil > 0) {
    return {
      action,
      hoursUntil,
      isAllowed: false,
      refundPercentage: 0,
      policyTier: "locked",
      shortMessage: "Locked",
      message:
        "This booking is no longer eligible for cancellation or rescheduling as per policy.",
    };
  }

  return {
    action,
    hoursUntil,
    isAllowed: false,
    refundPercentage: 0,
    policyTier: "no-show",
    shortMessage: "No-show",
    message:
      "This booking is no longer eligible for cancellation or rescheduling as per policy. No-show bookings are non-refundable.",
  };
}

export function getBookingPolicyLabel(policy: PolicyEvaluation) {
  if (policy.policyTier === "full") {
    return "Full refund";
  }

  if (policy.policyTier === "partial") {
    return `${policy.refundPercentage}% refund placeholder`;
  }

  if (policy.policyTier === "no-show") {
    return "No-show";
  }

  return "Action locked";
}
