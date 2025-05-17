import mongoose, { Schema, Document } from "mongoose";

export interface IListing extends Document {
  listingsVendorId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  expertise?: string[];
  duration: string;
  staff: string;
  packages: Array<{
    name: string;
    description: string;
    price: number;
    venueCapacity?: number;
  }>;
  mainImage: string;
  gallery: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    minPrice: number;
    maxPrice: number;
  };
  reviews: Array<{
    userId: mongoose.Types.ObjectId;
    rating: number;
    date: Date;
  }>;
  totalRating: number;
  viewCount: number;
  featured: boolean;
  status: "ACTIVE" | "DISABLE" | "DELETE";
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    venueCapacity: Number,
  },
  { _id: false }
);

const ReviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ListingSchema: Schema<IListing> = new Schema(
  {
    listingsVendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    expertise: [{ type: String }],
    duration: { type: String, required: true },
    staff: { type: String, required: true },
    packages: { type: [PackageSchema], default: [] },
    mainImage: { type: String, required: true },
    gallery: { type: [String], default: [] },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    pricing: {
      minPrice: { type: Number, required: true },
      maxPrice: { type: Number, required: true },
    },
    reviews: { type: [ReviewSchema], default: [] },
    totalRating: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLE", "DELETE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Listing =
  (mongoose.models.listings as mongoose.Model<IListing>) ||
  mongoose.model<IListing>("listings", ListingSchema);
export default Listing;
