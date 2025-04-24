import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  eventDetails: {
    date: Date;
    startTime: string;
    endTime: string;
    location: string;
    eventType: string;
    guestCount: number;
  };
  services: Array<{
    name: string;
    price: number;
    details?: string;
  }>;
  specialRequest?: string;
  status: "pending" | "confirmed" | "canceled" | "completed";
  totalAmount: number;
  depositAmount?: number;
  depositPaid: boolean;
  paymentStatus: "unpaid" | "partial" | "paid";
}


const bookingSchema: Schema<IBooking> = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventDetails: {
      date: {
        type: Date,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      eventType: {
        type: String,
        required: true,
      },
      guestCount: {
        type: Number,
        required: true,
      },
    },
    services: [
      {
        name: {
          type: String,
          requried: true,
        },
        price: {
          type: Number,
          requried: true,
        },
        details: String,
      },
    ],
    specialRequest: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled", "completed"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    depositAmount: Number,
    depositPaid: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);


const Booking = mongoose.models.bookings as mongoose.Model<IBooking>
|| mongoose.model<IBooking>('bookings', bookingSchema)

export default Booking