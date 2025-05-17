import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  location: z
    .object({
      city: z.string(),
      state: z.string(),
      country: z.string(),
      zip: z.string(),
    })
    .optional(),
  password: z.string().min(8).optional(),
  savedVendors: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "DISABLE", "DELETE"]).optional(),
});

