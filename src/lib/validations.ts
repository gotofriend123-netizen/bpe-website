import * as z from "zod";

export const bookingFormBaseSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  phoneNumber: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  bookingType: z.string().min(1, "Please select a booking type."),
  date: z.string().min(1, "Please select a date."),
  time: z.string().min(1, "Please select a time."),
  specificStudio: z.string().optional(),
  selectedPackage: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
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
      if (!data.selectedPackage || data.selectedPackage === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a package for the chosen studio.",
          path: ["selectedPackage"],
        });
      }
    }
  }
});

export const bookingFormSchema = bookingFormBaseSchema;

export const bookingRequestSchema = bookingFormBaseSchema.extend({
  slotId: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
