import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  category: string;
  description: string;
  services: Array<{
    name: string;
    description: string;
    price: number;
    duration: number;
  }>;
  coverImage: string;
  gallery: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    cordinates: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    minPrice: number;
    maxPrice: number;
    pricingDetails: string;
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
    userID: mongoose.Types.ObjectId;
    rating: number;
    comment: String;
    date: Date;
  }>;
  rating: number;
  viewCount: number;
  featured: Boolean;
  isVerifiedVendor: Boolean;
  isActive: Boolean;
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
    category: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    services: [
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
          requred: true,
        },
        duration: {
          type: Number,
          required: true,
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
      cordinates: {
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
    viewCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
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
  },
  { timestamps: true }
);


const Vendor = mongoose.models.vendors as mongoose.Model<IVendor> ||
 mongoose.model<IVendor>('vendors', vendorSchema)

export default Vendor