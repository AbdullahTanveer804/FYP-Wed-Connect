import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import Vendor from "@/app/model/vendorModel";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");

    if (!action || !["verify", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await connectDB();

    const vendor = await Vendor.findById(params.id);
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (action === "verify") {
      vendor.isVerified = true;
      vendor.status = "ACTIVE";
      await vendor.save();
      
      return NextResponse.json({
        message: "Vendor verified successfully",
        vendor
      });
    } else {
      // Cancel vendor registration
      vendor.status = "PENDING";
      await vendor.save();
      
      return NextResponse.json({
        message: "Vendor registration cancelled",
        vendor
      });
    }
  } catch (error) {
    console.error("Error processing vendor verification:", error);
    return NextResponse.json(
      { error: "Failed to process vendor verification" },
      { status: 500 }
    );
  }
}
