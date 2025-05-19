import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/connectDB";
import User from "@/app/model/userModel";
import Listing from "@/app/model/listingModel";
import Booking from "@/app/model/bookingModel";
import Vendor from "@/app/model/vendorModel";
import { authOptions } from "@/lib/authOptions";


// Helper: Convert month number to readable name
function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString("default", {
    month: "long",
  });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "summary";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // ====== SUMMARY REPORT ======
    if (type === "summary") {
      const [totalUsers, totalVendors, totalCustomers] = await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ role: "VENDOR" }),
        User.countDocuments({ role: "CUSTOMER" }),
      ]);

      const [totalListings, pendingListings, activeListings] =
        await Promise.all([
          Listing.countDocuments(),
          Listing.countDocuments({ status: "PENDING", ...dateFilter }),
          Listing.countDocuments({ status: "ACTIVE", ...dateFilter }),
        ]);

      const [
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        paidBookings,
      ] = await Promise.all([
        Booking.countDocuments({}),
        Booking.countDocuments({ status: "PENDING", ...dateFilter }),
        Booking.countDocuments({ status: "CONFIRMED", ...dateFilter }),
        Booking.countDocuments({ status: "COMPLETED", ...dateFilter }),
        Booking.find({ paymentStatus: "PAID", ...dateFilter }),
      ]);

      const totalRevenue = paidBookings.reduce((sum, b) => sum + b.amount, 0);

      const recentBookings = await Booking.find()
        .sort({ createdAt: -1 })
        .limit(5);

      return NextResponse.json({
        userStats: { totalUsers, totalVendors, totalCustomers },
        listingStats: { totalListings, pendingListings, activeListings },
        bookingStats: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          paidBookingsCount: paidBookings.length,
        },
        financialStats: { totalRevenue },
        recentActivity: { recentBookings },
      });
    }

    // ====== REVENUE REPORT ======
    if (type === "revenue") {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const revenueByMonth = [];

      for (let month = 1; month <= currentMonth; month++) {
        const start = new Date(currentYear, month - 1, 1);
        const end = new Date(currentYear, month, 0);

        const bookings = await Booking.find({
          paymentStatus: "PAID",
          createdAt: { $gte: start, $lte: end },
        });

        const revenue = bookings.reduce((sum, b) => sum + b.amount, 0);

        revenueByMonth.push({
          month: getMonthName(month),
          revenue,
          bookingsCount: bookings.length,
        });
      }

      return NextResponse.json({
        year: currentYear,
        revenueByMonth,
        totalRevenue: revenueByMonth.reduce((sum, r) => sum + r.revenue, 0),
      });
    }

    // ====== VENDOR REPORT ======
    if (type === "vendors") {
      const vendors = await Vendor.find();

      const vendorStats = await Promise.all(
        vendors.map(async (v) => {
          const vendorBookings = await Booking.find({
            vendorId: v._id,
            paymentStatus: "PAID",
            ...dateFilter,
          });

          const revenue = vendorBookings.reduce((sum, b) => sum + b.amount, 0);

          return {
            id: v._id,
            name: v.name,
            rating: v.rating,
            bookingsCount: vendorBookings.length,
            revenue,
          };
        })
      );

      vendorStats.sort((a, b) => b.revenue - a.revenue);

      return NextResponse.json({
        vendorStats,
        topVendors: vendorStats.slice(0, 10),
      });
    }

    // ====== USER GROWTH REPORT ======
    if (type === "users") {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const growth: any[] = [];

      for (let m = 1; m <= month; m++) {
        const start = new Date(year, m - 1, 1);
        const end = new Date(year, m, 0);

        const [users, vendors, customers] = await Promise.all([
          User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
          User.countDocuments({
            role: "VENDOR",
            createdAt: { $gte: start, $lte: end },
          }),
          User.countDocuments({
            role: "CUSTOMER",
            createdAt: { $gte: start, $lte: end },
          }),
        ]);

        growth.push({
          month: getMonthName(m),
          newUsers: users,
          newVendors: vendors,
          newCustomers: customers,
        });
      }

      return NextResponse.json({
        year,
        userGrowth: growth,
        totalUsers: await User.countDocuments(),
        totalVendors: await User.countDocuments({ role: "VENDOR" }),
        totalCustomers: await User.countDocuments({ role: "CUSTOMER" }),
      });
    }

    // ====== INVALID TYPE ======
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  } catch (error) {
    console.error("Report API error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
