import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/connectDB";
import { authOptions } from "@/lib/authOptions";
import Booking from "@/app/model/bookingModel";


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json();
    const allowedStatuses = ["PENDING", "CONFIRMED", "CANCELED"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    console.error("[ADMIN_BOOKING_STATUS_PATCH_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to update booking status." },
      { status: 500 }
    );
  }
}
