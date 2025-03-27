import {z} from 'zod'
import { categories } from '@/utils/category';
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
  });

  export const emailSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
  });




  export const createRoomSchema = z.object({
    name: z.string()
      .min(3, { message: "Room name must be at least 3 characters" })
      .max(100, { message: "Room name cannot exceed 100 characters" }),
    description: z.string()
      .min(10, { message: "Description must be at least 10 characters" })
      .max(500, { message: "Description cannot exceed 500 characters" }),
    videoUrl: z.string().url({ message: "Invalid video URL" }),
    category: z.enum(categories, {
      errorMap: () => ({ message: "Please select a valid category" })
    }),
    startDateTime: z.date({
      required_error: "Start date and time are required",
      invalid_type_error: "Invalid date and time"
    }).refine((date) => date > new Date(), {
      message: "Start date and time must be in the future",
      path: ["startDateTime"]
    })
  });
