import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import Booking from "@/app/model/bookingModel";
import Vendor from "@/app/model/vendorModel";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const bookingId = params.id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const userId = session.user._id;
    const userRole = session.user.role;

    if (userRole === "CUSTOMER" && booking.customerId.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    if (userRole === "VENDOR") {
      const vendor = await Vendor.findOne({ vendorId: userId }); // `vendorId` links to User._id

      if (!vendor || vendor._id?.toString() !== booking.vendorId.toString()) {
        return NextResponse.json(
          { error: "Unauthorized access" },
          { status: 403 }
        );
      }
    }

    // ADMINs have full access

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching specific booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
