"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { cancelBooking, rescheduleBooking } from "@/lib/booking/service";
import {
  getDashboardBookingForUser,
  requireDashboardUser,
} from "@/lib/dashboard/user-dashboard";

const bookingIdSchema = z.object({
  bookingId: z.string().min(1),
});

const rescheduleSchema = z.object({
  bookingId: z.string().min(1),
  slotId: z.string().min(1),
});

function revalidateDashboardPaths() {
  for (const path of [
    "/dashboard",
    "/dashboard/bookings",
    "/dashboard/cancel",
    "/dashboard/reschedule",
    "/booking/manage",
  ]) {
    revalidatePath(path);
  }
}

export async function cancelDashboardBookingAction(formData: FormData) {
  const currentUser = await requireDashboardUser();
  const parsed = bookingIdSchema.safeParse({
    bookingId: String(formData.get("bookingId") ?? ""),
  });

  if (!parsed.success) {
    redirect("/dashboard/bookings?error=Pick%20a%20booking%20before%20cancelling%20it.");
  }

  const booking = await getDashboardBookingForUser(currentUser.id, parsed.data.bookingId);
  if (!booking) {
    redirect("/dashboard/bookings?error=Booking%20not%20found.");
  }



  try {
    await cancelBooking(booking.reference);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to cancel this booking right now.";
    redirect(`/dashboard/cancel?id=${booking.id}&error=${encodeURIComponent(message)}`);
  }

  revalidateDashboardPaths();
  redirect(`/dashboard/bookings?updated=${booking.reference}&action=cancelled`);
}

export async function rescheduleDashboardBookingAction(formData: FormData) {
  const currentUser = await requireDashboardUser();
  const parsed = rescheduleSchema.safeParse({
    bookingId: String(formData.get("bookingId") ?? ""),
    slotId: String(formData.get("slotId") ?? ""),
  });

  if (!parsed.success) {
    redirect("/dashboard/bookings?error=Pick%20a%20booking%20and%20slot%20before%20rescheduling.");
  }

  const booking = await getDashboardBookingForUser(currentUser.id, parsed.data.bookingId);
  if (!booking) {
    redirect("/dashboard/bookings?error=Booking%20not%20found.");
  }



  const targetSlotId = parsed.data.slotId;
  if (!targetSlotId) {
    redirect("/dashboard/bookings?error=No%20alternate%20slot%20is%20currently%20available.");
  }

  try {
    const result = await rescheduleBooking(booking.reference, targetSlotId);
    revalidateDashboardPaths();
    redirect(`/dashboard/bookings?updated=${result.booking.reference}&action=rescheduled`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reschedule this booking right now.";
    redirect(`/dashboard/reschedule?id=${booking.id}&error=${encodeURIComponent(message)}`);
  }
}
