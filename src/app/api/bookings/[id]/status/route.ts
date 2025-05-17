import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import Booking from "@/app/model/bookingModel";
import Vendor from "@/app/model/vendorModel";
import { z } from "zod";
import mongoose from "mongoose";

const statusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Booking ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { status } = parsed.data;

    await connectDB();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (session.user.role === "VENDOR") {
      const vendor = await Vendor.findOne({ vendorId: session.user._id });
      if (
        !vendor ||
        !(vendor._id as mongoose.Types.ObjectId).equals(booking.vendorId)
      ) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    } else if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    booking.status = status;
    await booking.save();

    return NextResponse.json({ message: "Status updated", booking });
  } catch (error) {
    console.error("PATCH /bookings/:id/status error:", error);
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}
