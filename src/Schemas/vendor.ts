import { z } from "zod";

export const vendorProfileSchema = z.object({
  name: z.string(),
  bio: z.string(),
  businessName: z.string(),
  tagline: z.string().optional(),
  description: z.string(),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string(),
    website: z.string().optional(),
  }),
  socialMedia: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  portfolio: z.array(z.string()).optional(),
});

export const vendorUpdateSchema = vendorProfileSchema.partial(); // All fields now optional

export type VendorProfile = z.infer<typeof vendorProfileSchema>;