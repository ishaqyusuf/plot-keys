import { z } from "zod";
import {
  isNormalizedPhoneNumber,
  normalizePhoneNumber,
} from "@plotkeys/utils";

export const signUpInputSchema = z.object({
  company: z.string().trim().min(1, "Company name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  name: z.string().trim().min(1, "Full name is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long."),
  phoneNumber: z
    .string()
    .trim()
    .transform(normalizePhoneNumber)
    .refine(
      isNormalizedPhoneNumber,
      "Enter a valid phone number in international format.",
    ),
  subdomain: z
    .string()
    .trim()
    .min(3, "Choose a subdomain with at least 3 characters.")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens.",
    ),
});

export const signInInputSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const verifyEmailInputSchema = z.object({
  company: z.string().trim().min(1).optional(),
  subdomain: z.string().trim().min(1).optional(),
  token: z.string().trim().min(1, "Verification token is required."),
});

export const authSessionResultSchema = z.object({
  redirectTo: z.string().trim().min(1),
  sessionToken: z.string().trim().min(1),
});

export const signUpResultSchema = z.object({
  email: z.string().trim().email(),
  onboarding: z.object({
    company: z.string().trim().min(1),
    subdomain: z.string().trim().min(1),
  }),
  redirectTo: z.string().trim().min(1),
  verificationToken: z.string().trim().min(1),
});

export type SignInInput = z.infer<typeof signInInputSchema>;
export type SignUpInput = z.infer<typeof signUpInputSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailInputSchema>;
export type AuthSessionResult = z.infer<typeof authSessionResultSchema>;
export type SignUpResult = z.infer<typeof signUpResultSchema>;
