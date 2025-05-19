import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Vendor from "@/app/model/vendorModel";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const verified = searchParams.get("verified"); // "true" | "false" | undefined

    const query: any = {};
    if (verified === "true") query.isVerified = true;
    if (verified === "false") query.isVerified = false;

    const total = await Vendor.countDocuments(query);
    const vendors = await Vendor.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      vendors,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { message: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}
