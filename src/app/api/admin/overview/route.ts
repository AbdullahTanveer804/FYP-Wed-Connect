import Booking from "@/app/model/bookingModel";
import Listing from "@/app/model/listingModel";
import User from "@/app/model/userModel";
import Vendor from "@/app/model/vendorModel";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const [totalUsers, totalVendors, totalListings, totalBookings] =
      await Promise.all([
        User.countDocuments({ role: "CUSTOMER" }),
        Vendor.countDocuments(),
        Listing.countDocuments(),
        Booking.countDocuments(),
      ]);

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const monthlyRevenueAgg = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.totalRevenue || 0;

    const pendingVerifications = await Vendor.countDocuments({
      isVerified: false,
      status: "PENDING",
    });

    const newSignupsThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const activeListings = await Listing.countDocuments({
      status: "ACTIVE",
    });

    const disabledVendors = await Vendor.countDocuments({
      status: "DISABLE",
    });

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("vendorName customerName date amount status");

    return NextResponse.json(
      {
        totalUsers,
        totalVendors,
        totalListings,
        totalBookings,
        monthlyRevenue,
        pendingVerifications,
        newSignupsThisMonth,
        activeListings,
        disabledVendors,
        recentBookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADMIN_OVERVIEW_GET]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
