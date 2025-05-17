import { z } from "zod";

// Validation schema for creating a booking
export const bookingSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  message: z.string().optional(),
  amount: z.number().min(0, "Amount must be a positive number"),
});