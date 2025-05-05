import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  role: "customer" | "vendor" | "admin";
  profileImage?: string;
  location?: {
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  phoneNumber?: string;
  isVerified: boolean;
  savedVendors?: string[];
  verifyCode: string;
  verifyCodeExpiry: Date;
  forgotPasswordCode?: string;
  forgotPasswordCodeExpiry?: Date;
  isActive: boolean;
  status: "active" | "deactivate" | "delete"
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullname: {
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
      match: [/^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/, "Password must be 8+ chars with lowercase, number, and special character"]
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },
    profileImage: {
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
    phoneNumber: {
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
  },
  { timestamps: true }
);


const User =
  (mongoose.models.users as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("users", userSchema);

export default User;