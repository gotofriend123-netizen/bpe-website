import * as z from "zod";
import { BOOKING_TYPES, SPECIFIC_STUDIOS } from "@/config/data";

const bookingTypeIds = BOOKING_TYPES.map((b) => b.id) as [string, ...string[]];
const specificStudioIds = SPECIFIC_STUDIOS.map((s) => s.id) as [string, ...string[]];

export const bookingFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  phoneNumber: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  bookingType: z.enum(bookingTypeIds, {
    message: "Please select a booking type.",
  }),
  date: z.string().min(1, {
    message: "Please select a date.",
  }),
  time: z.string().min(1, "Please select a time."),
  specificStudio: z.enum(specificStudioIds).optional().or(z.literal("")),
  selectedPackageId: z.string().optional().or(z.literal("")),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Conditions.",
  }),
}).superRefine((data, ctx) => {
  if (data.bookingType === "verve-studio-left" || data.bookingType === "verve-studio-right") {
    if (!data.specificStudio || data.specificStudio === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Specific Studio is required for this booking type.",
        path: ["specificStudio"],
      });
    } else {
      // If a specific studio is selected, a package must be selected
      if (!data.selectedPackageId || data.selectedPackageId === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a package for the chosen studio.",
          path: ["selectedPackageId"],
        });
      }
    }
  }
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
