import { z } from "zod";

const requiredString = (message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, message),
  );

const passwordString = (requiredMessage: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z
      .string()
      .min(1, requiredMessage)
      .min(8, "Password must be at least 8 characters."),
  );

const nextPathSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => value.startsWith("/"), {
    message: "Redirect path must stay on this site.",
  });

export const loginSchema = z.object({
  email: requiredString("Email address is required.").pipe(
    z.string().email("Enter a valid email address."),
  ),
  password: passwordString("Password is required."),
  nextPath: nextPathSchema.optional(),
});

export const signupSchema = z
  .object({
    name: requiredString("Name is required.").pipe(
      z.string().min(2, "Name must be at least 2 characters."),
    ),
    email: requiredString("Email address is required.").pipe(
      z.string().email("Enter a valid email address."),
    ),
    password: passwordString("Password is required."),
    confirmPassword: passwordString("Please confirm your password."),
    nextPath: nextPathSchema.optional(),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });
