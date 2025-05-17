import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  image?: string;
  location?: {
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  phone?: string;
  isVerified: boolean;
  savedVendors?: string[];
  stripeCustomerId?: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  forgotPasswordCode?: string;
  forgotPasswordCodeExpiry?: Date;
  status: "ACTIVE" | "DISABLE" | "DELETE";
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      min: [3, "Full name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [8, "Password must be at least 8 characters"],
      match: [
        /^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must be 8+ chars with lowercase, number, and special character",
      ],
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "VENDOR", "ADMIN"],
      default: "CUSTOMER",
    },
    image: {
      type: String,
      default: "",
    },
    location: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      zip: {
        type: String,
        trim: true,
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    savedVendors: {
      type: [String],
      default: [],
    },
    stripeCustomerId: {
      type: String,
    },
    verifyCode: {
      type: String,
      default: "",
    },
    verifyCodeExpiry: Date,
    forgotPasswordCode: {
      type: String,
      default: "",
    },
    forgotPasswordCodeExpiry: Date,
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLE", "DELETE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.users as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("users", userSchema);

export default User;
