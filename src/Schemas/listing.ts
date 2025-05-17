import { z } from "zod";

export const listingSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  expertise: z.array(z.string()).optional(),
  duration: z.string(),
  staff: z.string(),
  packages: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number().min(0),
      venueCapacity: z.number().optional(),
    })
  ),
  mainImage: z.string().url(),
  gallery: z.array(z.string()).optional(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string().optional(),
    country: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  pricing: z.object({
    minPrice: z.number().min(0),
    maxPrice: z.number().min(0),
  }),
  featured: z.boolean().optional(),
});
