import { z } from "zod";

// Zod schema for category
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});
