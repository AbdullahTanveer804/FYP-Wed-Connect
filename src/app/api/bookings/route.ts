import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import Booking from "@/app/model/bookingModel";
import Vendor from "@/app/model/vendorModel";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const vendorId = url.searchParams.get("vendorId");
    const customerId = url.searchParams.get("customerId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const query: any = {};

    // Role-based access control
    if (session.user.role === "CUSTOMER") {
      query.customerId = session.user._id;
    } else if (session.user.role === "VENDOR") {
      const vendor = await Vendor.findOne({ vendorId: session.user._id });
      if (!vendor) {
        return NextResponse.json(
          { error: "Vendor profile not found" },
          { status: 404 }
        );
      }
      query.vendorId = vendor._id;
    }

    // Admin can apply additional filters
    if (session.user.role === "ADMIN") {
      if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
        query.vendorId = vendorId;
      }
      if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
        query.customerId = customerId;
      }
    }

    // Filter by status
    if (status && ["PENDING", "CONFIRMED", "CANCELED"].includes(status)) {
      query.status = status;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    return NextResponse.json({
      bookings,
      totalBookings: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
