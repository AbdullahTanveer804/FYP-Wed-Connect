import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  categoryId: mongoose.Types.ObjectId;
  description: string;
  packages: Array<{
    name: string;
    description: string;
    price: number;
    duration: number;
    capacity?: number;
  }>;
  coverImage: string;
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
    pricingDetails?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  socialMedia?: {
    instagram?: String;
    facebook?: String;
    twitter?: String;
  };
  reviews: Array<{
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: String;
    date: Date;
  }>;
  totalRating: number;
  viewCount: number;
  featured: Boolean;
  isVerifiedVendor: Boolean;
  isActive: Boolean;
  status: "active" | "deactivate" | "delete";
}

const vendorSchema: Schema<IVendor> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: [true, "Please provide a business name"],
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    description: {
      type: String,
      required: true,
    },
    packages: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        capacity: {
          type: Number,
        },
      },
    ],
    coverImage: String,
    gallery: [String],
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    pricing: {
      minPrice: {
        type: Number,
        required: true,
      },
      maxPrice: {
        type: Number,
        required: true,
      },
      pricingDetails: String,
    },
    contactInfo: {
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
      },
      phone: {
        type: String,
        required: true,
      },
      website: String,
    },
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String,
    },
    reviews: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          default: 0,
        },
        comment: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalRating: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isVerifiedVendor: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "deactivate", "delete"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Vendor =
  (mongoose.models.vendors as mongoose.Model<IVendor>) ||
  mongoose.model<IVendor>("vendors", vendorSchema);

export default Vendor;
