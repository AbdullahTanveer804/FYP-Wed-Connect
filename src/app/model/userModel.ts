import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
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
  isAdmin: boolean;
  isverfied: boolean;
  savedVendors: string[];
  verifyToken: string;
  verifyTokenExpiry: Date;
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: Date;
  isActive: boolean;
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      min: [3, "Full name must be atleast 3 characters"],
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
      min: [8, "Password must be atleast 8 characters"],
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },
    profileImage: {
      typpe: String,
      default:
        "https://res.cloudinary.com/dqj8xg3zv/image/upload/v1698231234/2023-10-24T12:47:14.000Z_1.png",
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isverfied: {
      type: Boolean,
      default: false,
    },
    savedVendors: {
      type: [String],
      default: [],
    },
    verifyToken: {
      type: String,
      default: "",
    },
    verifyTokenExpiry: Date,
    forgotPasswordToken: {
      type: String,
      default: "",
    },
    forgotPasswordTokenExpiry: Date,
  },
  { timestamps: true }
);


const User = mongoose.models.users as mongoose.Model<IUser> || mongoose.model<IUser>("users", userSchema)

export default User