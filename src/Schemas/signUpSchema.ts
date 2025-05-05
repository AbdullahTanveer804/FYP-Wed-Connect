import { z } from "zod";

export const signUpSchema = z.object({
  fullname: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/\d/, "Must include a number")
    .regex(/[\W_]/, "Must include a special character"),
});
