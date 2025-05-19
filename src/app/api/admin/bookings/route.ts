import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import Booking from "@/app/model/bookingModel";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const status = searchParams.get("status"); // optional
    const vendorId = searchParams.get("vendorId"); // optional
    const customerId = searchParams.get("customerId"); // optional
    const startDate = searchParams.get("startDate"); // optional (ISO format)
    const endDate = searchParams.get("endDate"); // optional (ISO format)

    const filter: any = {};

    if (status) filter.status = status;
    if (vendorId) filter.vendorId = vendorId;
    if (customerId) filter.customerId = customerId;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
      .populate("customerId", "name email")
      .populate("vendorId", "businessName")
      .populate("listingId", "title")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      bookings,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("[ADMIN_BOOKINGS_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings." },
      { status: 500 }
    );
  }
}
