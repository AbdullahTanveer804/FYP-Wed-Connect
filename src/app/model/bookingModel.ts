// models/Booking.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  vendorId: mongoose.Types.ObjectId;
  vendorName: string;
  vendorEmail: string;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  listingId: mongoose.Types.ObjectId;
  serviceTitle: string;
  date: Date;
  message?: string;
  amount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    vendorName: { type: String, required: true },
    vendorEmail: { type: String, required: true },

    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },

    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    serviceTitle: { type: String, required: true }, // e.g. “Wedding Photography”

    date: { type: Date, required: true },
    message: { type: String },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELED"],
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "REFUNDED"],
      default: "PENDING",
    },
    paymentIntentId: { type: String },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Booking =
  (mongoose.models.bookings as mongoose.Model<IBooking>) ||
  mongoose.model<IBooking>("bookings", BookingSchema);
export default Booking;
