// models/Vendor.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  bio: string;
  businessName: string;
  tagline?: string;
  description: string;
  profileImage?: string;
  coverImage?: string;
  memberSince: Date;
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  portfolio?: string[];
  rating: {
    average: number;
    totalReviews: number;
  };
  isVerified: boolean;
  featured: boolean;
  status: "ACTIVE" | "DISABLE" | "DELETE" | "PENDING";
}

const VendorSchema: Schema<IVendor> = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    bio: { type: String, required: true },
    businessName: { type: String, required: true },
    tagline: { type: String },
    description: { type: String, required: true },
    profileImage: { type: String },
    coverImage: { type: String },
    memberSince: { type: Date, default: Date.now },
    contactInfo: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      website: { type: String },
    },
    socialMedia: {
      instagram: { type: String },
      facebook: { type: String },
      twitter: { type: String },
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    portfolio: [{ type: String }],
    rating: {
      average: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
    isVerified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLE", "DELETE", "PENDING"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Vendor =
  (mongoose.models.vendors as mongoose.Model<IVendor>) ||
  mongoose.model<IVendor>("vendors", VendorSchema);
export default Vendor;
