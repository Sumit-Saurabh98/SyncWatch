import {z} from 'zod'

export const signUpSchema = z
.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "password must be contain numeric, spacial character, uppercase and lowercase combination of 6 characters" }),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and privacy policy",
  }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "password must be contain numeric, spacial character, uppercase and lowercase combination of 6 characters" }),
    rememberMe: z.boolean().optional(),
  });


  export const verificationSchema = z.object({
    code: z
      .string()
      .min(6, "Verification code must be 6 digits")
      .max(6, "Verification code must be 6 digits")
      .regex(/^\d{6}$/, "Verification code must contain only numbers")
  });

  export const emailSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
  });